require("dotenv").config();

const supabase = require("./src/lib/supabase");

async function test() {
  console.log("Supabase connected.");

  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .limit(1);

  if (error) {
    console.error(error.message);
  } else {
    console.log(data);
  }
}

test();
