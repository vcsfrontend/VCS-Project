
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SwitherService {
  openOffcanvas$: any;

  constructor(private http: HttpClient) {}

  //new api calls
  // private apiUrl = 'https://sasi-vcs-repo.onrender.com/auth/get_all_vcs_users';
  // GET request
  private apiUrl = environment.webURL;
  private adonaiURL = environment.masterURL;
  getCall(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  // POST request
  postCall(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data);
  }

  private logoutUrl = 'https://adonai.vcs.plus/api/account/oauth/token/logout';
  
  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  signupApi(data: any): Observable<any> { return this.http.post(`${this.apiUrl}auth/save_vcs_users`, data); }
  cmpnyUsers(companyname: any, companyCode :any): Observable<any> 
  { return this.http.get(`${this.apiUrl}auth/getUserDetails/${companyname}/${companyCode}`); }
  onForgotPassword(data:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/password_reset`, data); }
  onAdonai(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/sso_login_user/${data}`,''); }
  getAllUsers(): Observable<any> { return this.http.get(`${this.apiUrl}auth/get_all_vcs_users`); }
  getValidEmail(data:any): Observable<any> { return this.http.get(`${this.apiUrl}auth/getUser/${data}`); }
  onMailValidSignup(email:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/generate_otp?email=${email}&action=signup`,''); }
  onMailValidReset(email:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/generate_otp?email=${email}&action=reset`,''); }
  onOtpSignup(email:any, otp:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/validate_otp?email=${email}&otp=${otp}`,''); }
  specificUrl(email: string, designId: string): Observable<any> {const encodedEmail = encodeURIComponent(email);
    const apiUrl = `${this.adonaiURL}adonai/getSpecificDesignById?email=${encodedEmail}&designId=${designId}`;
    return this.http.get(apiUrl);
  }
  
    

  stageSave(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/save_design_stages`, data); }
  getStages(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/get_design_stages`, data); }
  deleteStage(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/delete_design_stages`, data); }

  pmntStageSave(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/save_payment_stages`, data); }
  getPmntStages(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/get_payment_stages`, data); }
  deletePmntStage(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/delete_payment_stages`, data); }

  // super admin Adonai apis 
  onAdonaiView(email:any): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/fetch_data_adonai/${email}`); }
  onAdonaiUpdate(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/update_subscription`, data); }
  adonaiHstry(email:any): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/sub_scription_history/${email}`); }
  userInfo(email:any): Observable<any> { return this.http.get(`${this.apiUrl}auth/fetch_user_info/${email}`); }
  // super admin Crm apis 
  onCrmView(email:any): Observable<any> { return this.http.get(`${this.apiUrl}auth/fetch_data_crm/${email}`); }
  onCrmUpdate(data:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/update_subscription_crm`, data); }
  
  crmHstry(email:any): Observable<any> { return this.http.get(`${this.apiUrl}auth/sub_scription_history/${email}`); }
  superAdminDbData(): Observable<any> { return this.http.get(`${this.apiUrl}auth/analytic_da_fe`); }

  projectLst(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/get_proj_details`, data); }
  designersDbData(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/proj_anl_de_ikl`, data); }
  saveProject(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/save_project_details`, data); }
  onProjectDtls(proj_id:any): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/getProjectByid/${proj_id} `); }
  onAddTaskDtls(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/add_project_cycle`, data); }
  getTaskDtls(project_id:any): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/get_project_cycle/${project_id}`); }
  getProjEstimation(project_id:any): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/get_payment_details/${project_id}`); }
  saveProjEstimation(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/project_payment_history`, data); }
  generatedOutputJson(value:any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/generatedOutputJson/${value}`); }

  ProjectList(): Observable<any> { return this.http.get(`${this.adonaiURL}enterprise/getProjectList`,); }
  // ProjectById(): Observable<any> { return this.http.get(`${this.adonaiURL}enterprise/getProjectById`,); }
  ProjFurniture(data : any): Observable<any> { return this.http.get(`${this.adonaiURL}enterprise/getProjFurniture?designId=${data}`); }
  ProjBasicInfo(data : any): Observable<any> { return this.http.get(`${this.adonaiURL}enterprise/getInfoAtLevel?designId=${data}`); }
  ProjBomList(designId: any): Observable<any> { return this.http.get(`${this.adonaiURL}/enterprise/getBomByProjectId?designId=${designId}`); }
  AuxilaryCosts(designId: any): Observable<any> { return this.http.get(`${this.adonaiURL}/enterprise/getAuxilaryCosts?designId=${designId}`);}
  Renderings(designId: any): Observable<any> { return this.http.get(`${this.adonaiURL}/enterprise/getRenderings?designId=${designId}`); }
  optimizeImportData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/optimize`, data); }
  GeneratedOutput(value:any): Observable<any> { return this.http.get(`${this.adonaiURL}enterprise/generated_output/${value}`); } 
  optimizeDownload(optimizeId:any): Observable<any> { return this.http.get(`${this.adonaiURL}enterprise/generated_output/${optimizeId}`); }
  ProjectDataList(email:any): Observable<any> { return this.http.get(`${this.adonaiURL}elite/getProjectDataList?email=${email}`); }
  inventoryCreateData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}elite/inventory_data_listing`, data); }
  optimizeGeneratedOutputData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/generated_output`, data); }
  StockData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getStackData`, data); }
  SawData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getSawData`, data); }
  saveSawData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_saw_data`, data); }
  saveStockData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_stock_data`, data); }
  bulkUploadParts(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/bulk_upload_parts`, data); }
  bulkUploadStock(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/bulk_upload_stock`, data); }
  HistoryUploadParts(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getHistoryBulkUpload`, data); }
  bulkPartsStock(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getBulkPartsStockData`, data); }
  PartsData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getPartsData`, data); }
  savePartsData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_parts_data`, data); }
  saveProductData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_product_data`, data); }
  savePanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_pannel_data`, data); }
  saveBasePanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_base_pannel_data`, data); }
  saveMakeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_make_data`, data); }
  saveGradeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_pannel_grade_data`, data); }
  displayProductData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getProductData`, data); }
  displayPanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_pannel_data`, data); }
  displayBasePanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_base_pannel_data`, data); }
  displayMakeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getMakeData`, data); }
  displayGradeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_pannel_grade_data`, data); }
  deleteProductData(prod_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_product_data/${prod_id}`);}
  
  //crm 
  CrmUsers(): Observable<any> { return this.http.get(`${this.apiUrl}auth/get_all_crm_users`); }  
  CrmLeads(): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/getLeadData`); }  
  AddCrmLeads(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/add_lead`, data); }
  UploadCrmLeads(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/upload_lead_sheet`, data); }
  CRMLeadSendMailFollowup(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/send_mail_followup`, data); }
  // CrmGetLeads(lead_id:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/get_Lead_view_data/${lead_id}`); }  
  EditCrmLeads(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/edit_lead`, data); }  
  ViewCrmLeads(leadId:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/get_Lead_view_data/${leadId}`); }  
  CRMAddFollowupLead(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/add_followup_Lead`, data); }
  CRMAllocateLeadExecutive(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/allocate_leads_to_executive`, data); }
  
  // https://adonai-vcs-fmbqfgbudgendtfu.israelcentral-01.azurewebsites.net/adonai/get_proj_details/{companyname}
}
