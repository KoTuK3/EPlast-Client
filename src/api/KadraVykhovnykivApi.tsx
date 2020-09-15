import Api from "./api";


const getAllKVs = async () => {
    const response = await Api.get("EducatorsStaff/kadras");
    return response;
  };
  

  const getAllKVTypes = async () => {
    const response = await Api.get("EducatorsStaff/kvTypes");
    return response;
  };


  const getAllKVswithGivenTypes = async (id: number) => {
    const response = await Api.get("EducatorsStaff/"+id);
    return response;
  };

  
  const getAllKVsOfGivenUser = async (UserId: string) => {
    const response = await Api.get("EducatorsStaff/UserKV/"+UserId);
    return response;
  };


  const putUpdateKadra = async (data: any) => {
    const response = await Api.put("EducatorsStaff/EditKadra", data);
    return response;
  };


  const deleteKadra = async (ID: number) => {
    const response = await Api.remove("EducatorsStaff/RemoveKadra/"+ID);
    return response;
  };

  

  const createKadra = async (data: any) => {
    const response = await Api.post("EducatorsStaff/CreateKadra", data);
    return response;
  };


  const doesUserHaveStaff = async (UserId:any, kadraId:number)=>{
    const response = await Api.get(`EducatorsStaff/${UserId}/${kadraId}`);
    return response;
  }
  
  
const doesRegisterNumberExist = async (numberInRegister:number)=>{
  const response = await Api.get(`EducatorsStaff/registerexist/${numberInRegister}`);
  return response;
}



const doesUserHaveStaffEdit = async (UserId:any, kadraId:number)=>{
  const response = await Api.get(`EducatorsStaff/edit/${UserId}/${kadraId}`);
  return response;
}


const doesRegisterNumberExistEdit = async (numberInRegister:number, kadraId:number)=>{
const response = await Api.get(`EducatorsStaff/edit/registerexist/${kadraId}/${numberInRegister}`);
return response;
}
 

  export default {
    doesRegisterNumberExistEdit,
    doesUserHaveStaffEdit,
    doesRegisterNumberExist,
    doesUserHaveStaff,
    createKadra,
    deleteKadra,
    putUpdateKadra,
    getAllKVsOfGivenUser,
    getAllKVswithGivenTypes,
    getAllKVTypes,
     getAllKVs
  };
  