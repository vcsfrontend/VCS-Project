
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, EMPTY  } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SwitherService {
  openOffcanvas$: any; userInfoCache: any = null; profilePic: string | null = null;
  userName: string | null = null;
  userInfoLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userInfoInFlight = false;
  constructor(private http: HttpClient) {}

  //new api calls
  // private apiUrl = 'https://sasi-vcs-repo.onrender.com/auth/get_all_vcs_users';
  // GET request
  private apiUrl = environment.webURL;
  private bizUrl = environment.bizPortal;
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
  
  userInfo(email: any): Observable<any> {
    if (this.userInfoCache) {
      this.profilePic = this.userInfoCache?.profilePic || null;
      this.userName =
        this.userInfoCache?.name || this.userInfoCache?.username || null;
      this.userInfoLoaded.next(true);
      return of(this.userInfoCache);
    }
    if (this.userInfoInFlight) {
      return EMPTY;
    }
    this.userInfoInFlight = true;
    return this.http
      .get(`${this.apiUrl}auth/fetch_user_info/${email}`)
      .pipe(
        tap((res: any) => {
          this.userInfoCache = res;
          this.profilePic = res?.profilePic || null;
          this.userName = res?.name || res?.username || null;
          this.userInfoLoaded.next(true);
          this.userInfoInFlight = false;
        })
      );
  }
  updateProfilePic(data:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/upload_profile`,data); }
  updateUserCompany(data:any): Observable<any> { return this.http.post(`${this.apiUrl}auth/update_user_company`,data); }
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
  quotationXl(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}quotation/generatePdf`, data); }

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
  panelListData(data: any): Observable<any> { return this.http.post(`${this.adonaiURL}/projo_boq/generate_bom__detailed_pannel_data`, data); }
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
  fetchLeadsIndividual(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/fetch_lead_data_individual`,data); } 
  filterLeads(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/filter_crm_data`, data); } 
  saveAppointment(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/schedule_appointment`, data); } 
  fetchAppointment(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/fetch_scheduled_appointments`, data); } 
  createTask(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/create_task`, data); } 
  fetchTasks(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/fetch_tasks`, data); } 
  fetchTasksCreatedBy(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/fetch_tasks_created_by`, data); }
  update_existing_campaign(leadIds: string[] | string, campaignId: string): Observable<any> {
    const leadIdsParam = Array.isArray(leadIds) ? leadIds.join('&leadIds=') : leadIds;
    const url = `${this.apiUrl}designation/add_leads_exsting_campaign?leadIds=${leadIdsParam}&campaignId=${campaignId}`;
    return this.http.get(url);
  }
  updateTasks(data:any): Observable<any> { return this.http.post(`${this.apiUrl}designation/edit_task`, data); } 
  updateLeadCompletion(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/update_lead_completion_status`, data); } 

  savedynamicMargins(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}quotation/save_dynamic_margins`, data); } 
  fetchDynamicMargin(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}quotation/get_dynamic_margins`, data); } 
  saveProjectConfig(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}quotation/save_project_conf`, data); } 
  fetchProjectConfig(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}quotation/get_project_conf`, data); }
  quotationHistory(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}quotation/getQuoteGenHistory`, data); }  

  // Boq
  fetchBoqData(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/genrate_bom_data`, data); }  
  saveElementData(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/item_custom_addition`, data); }  
  updateElementData(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/update_boq_data`, data); }  
  createProposal(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/create_proposal`, data); }  
  fetchProposal(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/get_proposal_dashboard_data`, data); }  
  fetchProposalContent(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/get_proposal_contnet`, data); } 
  approveProposal(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/proposal_approval`, data); } 
  extraContentProposal(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/extra_contnet_proposal`, data); } 
  fetchClientOrder(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/get_client_order_data`, data); }
  fetchClientOrderContent(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/get_client_order_content`, data); }
  fetchRecceData(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/get_recce_data`, data); }
  fetchAssgnAdonaiDesign(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/get_proj_design`, data); }
  updateAssgnAdonaiDesign(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}adonai/update_project_details`, data); }
  getLibrarayData(): Observable<any> { return this.http.get(`${this.bizUrl}api/libraries/items/get/all`); }
  getUomNames(): Observable<any> { return this.http.get(`${this.bizUrl}api/uoms`); }
  getLibrarayNames(): Observable<any> { return this.http.get(`${this.bizUrl}api/libraries/shared`); }
  getCategoriesName(): Observable<any> { return this.http.get(`${this.bizUrl}api/categories`); }
  addRole(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/roles/createRole`, data); }
  getRole(companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}api/roles/listRoles?companyCode=${companyCode}`); }  
  updateRole(id:any,name:any,description :any): Observable<any> { return this.http.put(`${this.apiUrl}api/roles/updateRole/${id}?name=${name}&description=${description}`,"");} 
  deleteRole(id :any): Observable<any> { return this.http.delete(`${this.apiUrl}api/roles/deleteRole/${id}`); }  

  createDepartment(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/departments/createDepartment`, data); }
  getDepartment(companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}api/departments/listDepartments?companyCode=${companyCode}`); }  
  updateDepartment(id: any, name: any, description: any): Observable<any> {
    return this.http.put(`${this.apiUrl}api/departments/updateDepartment/${id}?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`, null);
  }  
  deleteDepartment(id :any): Observable<any> { return this.http.delete(`${this.apiUrl}api/departments/deleteDepartment/${id}`); }  

  createPermission(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/permissions/createPermission`, data); }
  getPermissions(companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}api/permissions/listPermissions?companyCode=${companyCode}`); }  
  updatePermission(id:any,name:any,description :any,subPermission :any): Observable<any> { return this.http.put(`${this.apiUrl}api/permissions/updatePermission/${id}?name=${name}&description=${description}`,"");} 
  deletePermission(id :any): Observable<any> { return this.http.delete(`${this.apiUrl}api/permissions/deletePermission/${id}`); }  

  assignRoleToDepartment(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/department-roles/assignRoleToDepartment`, data); }
  getAssignedRoles(departmentIds:number[] ,companyCode : any): Observable<any> { 
    const deptRoleParams = departmentIds.map(id => `departmentIds=${id}`).join('&');
    const url =`${this.apiUrl}api/department-roles/listRolesByDepartment?${deptRoleParams}&companyCode=${companyCode}`;
    return this.http.get(url); 
  } 
  deleteAssignedRoles(id :any): Observable<any> { return this.http.delete(`${this.apiUrl}api/department-roles/deleteDepartmentRole/${id}`); }  

  assignPermissionToRole(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/role-permissions/assignPermissionToDeptRole`, data); }
  getAssignPermissions(deptRoleIds: number[], companyCode: string): Observable<any> {
    const deptRoleParams = deptRoleIds.map(id => `deptRoleIds=${id}`).join('&');
    const url = `${this.apiUrl}api/role-permissions/listPermissionsByDeptRole?${deptRoleParams}&companyCode=${companyCode}`;

    return this.http.get(url);
  }
  updateSubPermission(id:any,subPermission :any): Observable<any> { return this.http.put(`${this.apiUrl}api/role-permissions/updateRolePermission/${id}?subPermission=${subPermission}`,"");} 

  deleteAssignedPermission(deptRoleId  :any,permissionId :any,companyCode :any): Observable<any> { return this.http.delete(`${this.apiUrl}api/role-permissions/removePermissionFromDeptRole?deptRoleId=${deptRoleId}&permissionId=${permissionId}&companyCode=${companyCode}`); }  


  assignUserToDeptRole(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/user-mapping/assign`, data); }
  getAssignUser(email  :any ,companyCode : any): Observable<any> { return this.http.get(`${this.apiUrl}api/user-mapping/${email }?companyCode=${companyCode}`); } 
  deleteAssignUser(email :any,companyCode:any,deptRoleId :any): Observable<any> { return this.http.delete(`${this.apiUrl}api/user-mapping/remove?email=${email }&deptRoleId=${deptRoleId}&companyCode=${companyCode}`); } 
  deleteAssignTask(askId: number, taskId: number, deptRoleId: number, assignmentId: number, companyCode: string): Observable<any> {
  const url = `${this.apiUrl}tasks/assign/removal?taskId=${taskId}&deptRoleId=${deptRoleId}&assignmentId=${assignmentId}&companyCode=${companyCode}`;
  return this.http.delete(url);
}


  getUserAccess(email :any): Observable<any> { return this.http.get(`${this.apiUrl}api/users/${email}/access`); }  

  
  
  createRecce(data: any): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (key === 'files' && Array.isArray(value)) {
        value.forEach((file: any) => {
          if (file instanceof File) {
            formData.append('files', file, file.name); 
          }
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    return this.http.post(`${this.adonaiURL}projo_boq/recce_creation`, formData);
  }
   updateRecce(data: any): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (key === 'files' && Array.isArray(value)) {
        value.forEach((file: any) => {
          if (file instanceof File) {
            formData.append('files', file, file.name); 
          }
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    return this.http.post(`${this.adonaiURL}projo_boq/update_recce`, formData);
  }

  createGloabalTaks(data:any): Observable<any> { return this.http.post(`${this.apiUrl}api/globalTasks/createGlobalTask`, data); }
  getAllGlobalTasks(companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}api/globalTasks/listGlobalTaskData?companyCode=${companyCode}`);}
  updateGlobalTask(taskData: any): Observable<any> { return this.http.put(`${this.apiUrl}api/globalTasks/update/${taskData.id}`, taskData);}
  deleteGlobalTaskById(taskId: number): Observable<any> { return this.http.delete(`${this.apiUrl}api/globalTasks/delete/${taskId}`);}

  createManualTask(data:any): Observable<any> { return this.http.post(`${this.apiUrl}tasks/schedule/createManualTask`, data); }
  getManualTasks(): Observable<any> { return this.http.get(`${this.apiUrl}tasks/schedule/getScheduledTasksData`); }
  updateManualTask(payload: any): Observable<any> { return this.http.put(`${this.apiUrl}tasks/schedule/updateManualTask/${payload.id}`, payload);}
  deleteManualTaskById(taskId:any): Observable<any> { return this.http.delete(`${this.apiUrl}tasks/schedule/deleteManualTask/${taskId}`); }

  assignTasksRoles(data:any): Observable<any> { return this.http.post(`${this.apiUrl}tasks/assign/user-or-roles`, data); }
  fetchTasksAssignedBy(userEmail:any, companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}tasks/assign/listTasksAssignedBy?userEmail=${userEmail}&companyCode=${companyCode}`); }
  getTasksAssignTo(currentUserEmail :any, companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}tasks/assign/listTasksAssignedTo?currentUserEmail=${currentUserEmail}&companyCode=${companyCode}`); }
  getAllAssignTasks(userDeptRole:any, companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}tasks/assign/listAssignedTasksOnUserDeptId?userDeptRole=${userDeptRole}&companyCode=${companyCode}`); }
  deleteAssignTasks(taskId :any, deptRoleId :any, assignmentId:any, companyCode:any): Observable<any> { return this.http.delete(`${this.apiUrl}tasks/assign/removal?taskId=${taskId}&deptRoleId=${deptRoleId}&assignmentId=${assignmentId}&companyCode=${companyCode}`); }
  adminAccessAllUsers(companyCode:any): Observable<any> { return this.http.get(`${this.apiUrl}api/users/admin/access?companyCode=${companyCode}`); }


  crmClients(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/getCompletedClientData`, data); }


  //cutlist
  saveOptimizerCut(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/save_optimizer_cut`, data); }
  getOptimizerCut(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/get_optimizer_cut`, data); }
  deleteOptimizerCut(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/delete_optimizer_cut`, data); }
  generateCutList(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}projo_boq/generate_cut_list`, data); }
  downloadCutList(data:any): Observable<any> { return this.http.post(`${this.adonaiURL}optimizer/download_cut_list_data`, data); }

  fetchLeads(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/v2_fetch_lead_data_individual`, data); }
  fetchLeadsInCampaigns(data:any): Observable<any> { return this.http.post(`${this.apiUrl}crmActions/v2_fetch_lead_data`, data); }

  // https://adonai-vcs-fmbqfgbudgendtfu.israelcentral-01.azurewebsites.net/adonai/get_proj_details/{companyname}
}
