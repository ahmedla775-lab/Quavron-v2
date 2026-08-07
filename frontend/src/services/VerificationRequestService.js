import { supabase } from "../lib/supabase";


class VerificationRequestService {


  async getMyRequest(userId){

    return await supabase
      .from("verification_requests")
      .select("*")
      .eq("user_id",userId)
      .order("created_at",{
        ascending:false
      })
      .limit(1)
      .maybeSingle();

  }



  async getAll(status=null){

    let query =
      supabase
      .from("verification_requests")
      .select(`
        *,
        profiles:user_id(
          id,
          username,
          full_name,
          avatar_url,
          verified,
          verification_type
        )
      `)
      .order("created_at",{
        ascending:false
      });


    if(status){
      query=query.eq(
        "status",
        status
      );
    }


    return await query;

  }




  async create(values){
    return await supabase
      .from("verification_requests")
      .insert({
        user_id:
          values.user_id,

        status:
          values.status || "pending",

        account_type:
          values.account_type || "individual",

        verification_kind:
          values.verification_kind ||
          values.verification_type ||
          "blue"
      })
      .select()
      .single();
  }


  async update(id,values){

    return await supabase
      .from("verification_requests")
      .update(values)
      .eq("id",id)
      .select()
      .single();

  }





  async approve(
    requestId,
    userId,
    type="blue"
  ){


    await supabase
      .from("verification_requests")
      .update({

        status:"approved"

      })
      .eq("id",requestId);



    return await supabase
      .from("profiles")
      .update({

        verified:true,

        verification_type:type

      })
      .eq("id",userId);


  }





  async reject(
    requestId,
    reason=""
  ){

    return await supabase
      .from("verification_requests")
      .update({

        status:"rejected",

        rejection_reason:reason

      })
      .eq("id",requestId);


  }




  async removeVerification(userId){

    return await supabase
      .from("profiles")
      .update({

        verified:false,

        verification_type:null

      })
      .eq("id",userId);

  }


}


export default new VerificationRequestService();
