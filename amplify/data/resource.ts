import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { image } from "framer-motion/client";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      isDone: a.boolean(),
      content: a.string(),
      category: a.string().default("personal"),
     }).authorization(allow => [allow.owner()]),
});
const schema2 = a.schema({
  subscriptionModel: a
    .model({
      isNew: a.boolean().default(false),
      type: a.string().default(""),
      category: a.string().default("personal"),
      image: a.string().default(""),
    }).authorization(allow => [allow.owner()]),
});
const fullSchema = a.schema({
  ...schema.models,        // Todo
  ...schema2.models,       // subscriptionModel
});
export type Schema = ClientSchema<typeof fullSchema>;
export const data = defineData({
  schema:fullSchema, // This tells the data client in your app (generateClient())
  authorizationModes: {
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token. 
    defaultAuthorizationMode: 'userPool',

    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
