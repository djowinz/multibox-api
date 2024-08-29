export enum ServiceErrorCode {
    Prisma_P2002 = 'P2002',
    Prisma_P2018 = 'P2018',
    Prisma_Unknown = 'PUnknown',

    Nylas_Token_Exchange_Error = 'NYS_TX_S500',
    Nylas_Folder_Retrival_Error = 'NYS_FR_S521',
    Nylas_Folder_Create_Error = 'NYS_FC_S522',
    Nylas_Folder_Update_Error = 'NYS_FU_S523',
    Nylas_Message_Retrival_Error = 'NYS_MR_S534',
    Nylas_Object_Patch_Error = 'NYS_OP_S591',
    Nylas_Object_Delete_Error = 'NYS_OD_S592',
    Nylas_Thread_Retrival_Error = 'NYS_TR_S513',
    Nylas_Token_Revoke_Error = 'NYS_TRV_S501',

    Unknown = 'Unknown',
}
