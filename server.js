const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = "mongodb+srv://<name>:<password>@cluster0.laicona.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    /*await createListings(client,[
        {
            name: "abc",
            age: 16,
            education: "High School"
        },

        {
            name: "XYZ",
        },

        {
            name: "PQR",
            age: 78,
            education: "PhD",
            job: "Teacher"
        }]

    );*/
    // await findOneListingByName(client,"abc");
    //await findagelessthan20(client, {min_age : 30})
    //await updatelistbyname(client, "SDR", {name : "qwerty"})
    //await upsertlistingbyname(client, "cba", {name: "bca", age: 20})
    //await updatemany(client);
    //await deletelistingbyname(client,"SDR");
    await deletemany(client);

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

async function createListings(client, newListings){
    const result = await client.db("Users").collection("user").insertMany(newListings); //for creating multiple listings
    console.log(`${result.insertedCount} listings were created`);
}

async function createListing(client, newListing){
    const result = await client.db("Users").collection("user").insertOne(newListing); //for creating a single listing
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("Users").collection("user").findOne({ name: nameOfListing }); //for finding one
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

async function findagelessthan20(client, {
    min_age = 0                                  //for finding multiples
    }) {
    const cursor = client.db("Users").collection("user").find(
        {
            age: {$lte : min_age}
        }
    )

    const results = await cursor.toArray();
    for(var i =0; i<results.length; i++)
    {
        console.log(results[i])
    } 
}

async function updatelistbyname(client, nameofListing, updatedlisting) {
    const result = await client.db("Users").collection("user").updateOne( //updating the databse
        { name : nameofListing},
        { $set : updatedlisting} //$set sets the updated stuff
    );

    console.log(`${result.matchedCount} documents matched the query criteria`)
    console.log(`${result.modifiedCount} documents updated`)
}

async function upsertlistingbyname(client, nameOfListing, updatedlisting) {
    const result = await client.db("Users").collection("user").updateOne( //updating the databse if it doesn't exist then insert it
        { name : nameOfListing},
        { $set : updatedlisting}, //$set sets the updated stuff
        { upsert: true}
    );

    console.log(`${result.matchedCount} documents matched the query criteria`)

    if(result.upsertedCount > 0) {
        console.log(`One document was inserted with the ID ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} documents updated`)
    }
}

async function updatemany(client) {
    const result = await client.db("Users").collection("user")
    .updateMany(
        {hobby : {$exists: false}}, //if hobby property doesn't exists
        {$set : {hobby: "Unknown"}}
    )
    console.log(`${result.matchedCount} documents matched the query criteria`)
    console.log(`${result.modifiedCount} documents updated`)
}

async function deletelistingbyname(client, listingname) {
    const result = await client.db("Users").collection("user").deleteOne({
        name : listingname
    })
    console.log(`${result.deletedCount} documents deleted`)
}

async function deletemany(client) {
    const result = await client.db("Users").collection("user").
    deleteMany({age : {$lte: 20}})
    console.log(`${result.deletedCount} documents deleted`)
}