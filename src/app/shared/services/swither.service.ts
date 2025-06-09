
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

  //sales team
  saveSalesUsers(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/save_users_designation_sales`, data); }
  SalesUsers(email:any): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/get_user_sales_designation/${email}`); }
  allSalesUsers(): Observable<any> { return this.http.get(`${this.adonaiURL}adonai/get_sales_user_data`,); }
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
  saveOrUpdateProduct(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_product_data`, data); }
  saveOrUpdatePanel(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_pannel_data`, data); }
  saveBasePanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_base_pannel_data`, data); }
  saveMakeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_make_data`, data); }
  saveGradeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_pannel_grade_data`, data); }
  saveSkinData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_optimizer_skin_data`, data); }
  saveSkinBrandData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_skin_brand_data`, data); }
  saveSkinTypeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_skin_type_data`, data); }
  saveSkinFinishData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_skin_finish_data`, data); }
  saveEdgebandData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_optimizer_edge_band`, data); }
  saveEdgeContentData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_edge_content`, data); }
  displayProductData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getProductData`, data); }
  displayPanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_pannel_data`, data); }
  displayEdgebandData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_optimizer_edge_band`, data); }
  displayBasePanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_base_pannel_data`, data); }
  displayMakeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/getMakeData`, data); }
  displayGradeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_pannel_grade_data`, data); }
  displaySkinData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_optimizer_skin_data`, data); }
  displaySkinBrandData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_skin_brand_data`, data); }
  displaySkinTypeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_skin_type_data`, data); }
  displaySkinFinishData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_skin_finish_data`, data); }
  deleteProductData(prod_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_product_data/${prod_id}`);}
  deletePannelData(pannel_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_pannel_data/${pannel_id}`);}
  deleteBasePanelData(base_pannel_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_base_pannel_data/${base_pannel_id}`);}
  deleteMakeData(make_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_make_data/${make_id}`);}
  deletePannelGradeData(pannel_grade_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_pannel_grade_data/${pannel_grade_id}`);}
  deleteSkinData(optimizer_skin_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_optimizer_skin_data/${optimizer_skin_id}`);}
  deleteSkinBrandData(skin_brand_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_skin_brand_data/${skin_brand_id}`);}
  deleteSkinTypeData(skin_type_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_skin_type_data/${skin_type_id}`);}
  deleteSkinFinishData(skin_finish_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_skin_finish_data/${skin_finish_id}`);}
  displayProcessPanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_processed_pannel`, data); }
  saveProcessPanelData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_processed_pannel`, data); }
  deleteProcessPanelData(pannel_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_processed_pannel/${pannel_id}`);}
  getEdgeContentData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_edge_content`, data); }
  deleteEdgeContentData(optimizer_edge_band_id: any): Observable<any> { return this.http.get(`${this.adonaiURL}optimizer/delete_optimizer_edge_band/${optimizer_edge_band_id}`); }
  deleteEdgeData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/delete_edge_content`, data); }
  //crm 
  CrmUsers(): Observable<any> { return this.http.get(`${this.apiUrl}auth/get_all_crm_users`); }  
  CrmLeads(campaignId:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/getLeadData?campaignId=${campaignId}`); }  
  FetchLeadData(entryBy:any, campaignId:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/fetch_lead_data/${entryBy}?campaignId=${campaignId}`); }  
  AddCrmLeads(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/add_lead`, data); }
  UploadCrmLeads(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/upload_lead_sheet`, data); }
  CRMLeadSendMailFollowup(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/send_mail_followup`, data); }
  EditCrmLeads(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/edit_lead`, data); }  
  ViewCrmLeads(leadId:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/get_Lead_view_data/${leadId}`); }  
  CRMAddFollowupLead(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/add_followup_Lead`, data); }
  CRMAllocateLeadExecutive(data: any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/allocate_leads_to_executive`, data); }
  SaveCrmStatus(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/save_crm_status`, data); }  
  CrmStatus(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/get_crm_status`, data); }  
  SaveCrmStages(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/save_crm_stages`, data); }  
  CrmStages(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/get_crm_stages`, data); }  
  saveDesigCrm(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/save_desig_crm`, data); }  
  designationCrmRloes(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/get_designation_roles`, data); }  
  saveCampaignData(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/create_campaign`, data); } 
  displayCampaignData(data: any): Observable<any> { return this.http.post(`${this.apiUrl}designation/list_campaigns`, data); }
  deleteLeadStages(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/deleteStages`, data); }  
  deleteLeadStatus(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/deleteStatus`, data); }    
  StatusCount(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/get_count_Status`, data); }  
  sepecificCampaign(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/get_campaign_specific`,data); } 
  deleteCampaign(campaign_Id:any): Observable<any> { return this.http.get(`${this.apiUrl}designation/delete_campaign/${campaign_Id}`); }   
  selectFormTemplate(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/create_crm_email_template`,data); }
  listFormTemplate(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/list_template_names`,data); }  
  fetchFormTemplate(templateGenId :any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/getTemplateOnTemplateGenId?templateGenId=${templateGenId }`); } 
  deleteLeads(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/delete_lead`,data); }  
  allEmailTemplates(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/get_all_email_templates`,data); } 
  addLeadEntry(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/add_lead_entry_columns`,data); }  
  listLeadEntry(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/list_lead_entry_columns`,data); }
  editLeadEntry(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/edit_lead_entry_columns`,data); }   
  deleteLeadEntry(column_id:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/delete_lead_column/${column_id}`); } 
  fetchLeadsIndividual(entryBy:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/fetch_lead_data_individual/${entryBy}`); } 
  filterCrmLeads(data:any): Observable<any> { return this.http.get(`${this.apiUrl}crmActions/fetch_lead_data_individual`, data); } 


  // https://adonai-vcs-fmbqfgbudgendtfu.israelcentral-01.azurewebsites.net/adonai/get_proj_details/{companyname}
}
