import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

console.log("Hello from Bodhi BBS!")



const router = new Router();

router
  .get("/constant", async (context) => {
    // * get value by the key and app name.
    // 1. parse params in get req.
    const queryParams = context.request.url.searchParams;
    const appName = queryParams.get('app_name');
    const key = queryParams.get('key');

    // 2. parse params in post req.
    // let content = await context.request.body.text();
    // content = JSON.parse(content);
    // const uuid = content.uuid;

    const supabase = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    // Ensure both app_name and key are provided
    if (!appName || !key) {
      context.response.status = 400;
      context.response.body = "Missing required query parameters: app_name or key";
      return;
    }

    // Querying data from Supabase
    const { data, error } = await supabase
      .from('constants')
      .select('*')
      .eq('app_name', appName)
      .eq('key', key)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      context.response.status = 500;
      context.response.body = "Failed to fetch data";
      return;
    }

    context.response.body = data;
})


const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

console.info("CORS-enabled web server listening on port 8000");

await app.listen({ port: 8000 });