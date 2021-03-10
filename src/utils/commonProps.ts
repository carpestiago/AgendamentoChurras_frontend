export interface IOptions {
    label: string,
    value: any
  };

  export interface IMinimunEventDataTarget {
    id: string,
    name: string,
    value: any
  }
  
  export interface IMinimunEventData {
    target: IMinimunEventDataTarget
  }

  export type MinimunEventCallBack = (e: IMinimunEventData) => void; // for onChange, onBlur handlings

  export interface IFormikProps {
    touched: any
    errors: any
    values: any
    submitCount: number
    isSubmitting: boolean
    handleChange: MinimunEventCallBack
    handleBlur: MinimunEventCallBack
    setFieldValue(field: string, value: any, shouldValidate?: boolean): void
    setFieldTouched(field: string, isTouched?: boolean, shouldValidate?: boolean): void
  }
