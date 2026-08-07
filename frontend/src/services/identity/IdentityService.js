import { supabase } from "../../lib/supabase";


export async function updateIdentity({
  accountType,
  roles = [],
  officialPosition = null,
}) {

  return await supabase.auth.updateUser({
    data: {
      account_type: accountType,
      roles,
      official_position: officialPosition,
    },
  });

}


export async function getIdentity(user) {

  return {
    accountType:
      user?.user_metadata?.account_type || "personal",

    roles:
      user?.user_metadata?.roles || [],

    officialPosition:
      user?.user_metadata?.official_position || null,
  };

}


const IdentityService = {
  updateIdentity,
  getIdentity,
};


export default IdentityService;
