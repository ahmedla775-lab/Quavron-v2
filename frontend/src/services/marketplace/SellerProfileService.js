import { supabase } from "../../lib/supabase";
import { SELLER_VERIFICATION_MAP } from "../../constants/sellerVerification";


export async function createSellerProfile({
  userId,
  sellerType,
}) {

  return await supabase
    .from("seller_profiles")
    .insert({

      user_id: userId,

      seller_type: sellerType,

      status: "pending",

      verification_required: true,

      verification_type:
        SELLER_VERIFICATION_MAP[sellerType] || "BLUE",

    })
    .select()
    .single();

}



export async function getSellerProfile(userId) {

  return await supabase
    .from("seller_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

}



export async function updateSellerStatus(
  userId,
  status
) {

  return await supabase
    .from("seller_profiles")
    .update({
      status,
    })
    .eq("user_id", userId);

}



const SellerProfileService = {

  createSellerProfile,

  getSellerProfile,

  updateSellerStatus,

};


export default SellerProfileService;
