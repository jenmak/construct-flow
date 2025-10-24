// Local AppRouter type stub for Railway deployment
// This avoids the workspace dependency issue

export type AppRouter = {
  _def: any
  createCaller: any
  projects: {
    get: {
      queryOptions: (input: { id: string }) => any
    }
    list: {
      queryOptions: () => any
    }
    create: {
      useMutation: () => any
    }
    delete: {
      useMutation: () => any
    }
    submitQuestionnaire: {
      useMutation: () => any
    }
  }
  questionnaire: {
    getQuestionnaireOptions: {
      queryOptions: (input: any) => any
    }
    getPermitRequirements: {
      queryOptions: (input: any) => any
    }
  }
}
