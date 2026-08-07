export function canAccessSeller(user) {

  if (!user) return false;


  const roles =
    user.user_metadata?.roles || [];


  return roles.includes("seller");

}


export function hasBusinessIdentity(user) {

  const type =
    user?.user_metadata?.account_type;


  return [
    "business",
    "organization",
    "official",
  ].includes(type);

}


const SellerAccessService = {
  canAccessSeller,
  hasBusinessIdentity,
};


export default SellerAccessService;
