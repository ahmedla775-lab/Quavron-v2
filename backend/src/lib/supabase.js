import { createClient }
from "@supabase/supabase-js";

const supabaseUrl =
"https://bxjsfbexfjvqjiaqtmbm.supabase.co";

const supabaseKey =
"sb_publishable_Q2YDV3nTxgvM3GMNfAmZ0Q_NUNq6_gD";

export const supabase =
createClient(
  supabaseUrl,
  supabaseKey
);⁰

