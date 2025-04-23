import { useState, useCallback, useMemo } from 'react';

export type ValidationFunction<T> = (value: T) => string | null;

export interface FieldConfig<T> {
  initialValue: T;
  validate?: ValidationFunction<T>;
}

export interface FormField<T> {
  value: T;
  error: string | null;
  touched: boolean;
  onChange: (value: T) => void;
  onBlur: () => void;
  reset: () => void;
}

export interface FormConfig {
  [key: string]: FieldConfig<any>;
}

export interface FormState {
  [key: string]: FormField<any>;
}

export interface UseFormReturn {
  formState: FormState;
  handleSubmit: (onSubmit: (values: Record<string, any>) => void) => void;
  isValid: boolean;
  isDirty: boolean;
  reset: () => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string | null) => void;
  getValues: () => Record<string, any>;
  isFormValid: () => boolean;
}

export function useForm(config: FormConfig): UseFormReturn {
  // Initialize form state
  const initialState = useMemo(() => {
    const state: FormState = {};
    
    for (const [name, fieldConfig] of Object.entries(config)) {
      state[name] = {
        value: fieldConfig.initialValue,
        error: null,
        touched: false,
        onChange: () => {},
        onBlur: () => {},
        reset: () => {},
      };
    }
    
    return state;
  }, []);
  
  const [formState, setFormState] = useState<FormState>(initialState);
  
  // Function to handle field change
  const handleChange = useCallback((name: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        touched: true,
        error: config[name]?.validate ? config[name].validate!(value) : null,
      },
    }));
  }, [config]);
  
  // Function to handle field blur
  const handleBlur = useCallback((name: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        touched: true,
        error: config[name]?.validate ? config[name].validate!(prevState[name].value) : null,
      },
    }));
  }, [config]);
  
  // Function to reset a specific field
  const resetField = useCallback((name: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: config[name].initialValue,
        error: null,
        touched: false,
      },
    }));
  }, [config]);
  
  // Initialize field handlers
  const formStateWithHandlers = useMemo(() => {
    const newState: FormState = {};
    
    for (const [name, field] of Object.entries(formState)) {
      newState[name] = {
        ...field,
        onChange: (value: any) => handleChange(name, value),
        onBlur: () => handleBlur(name),
        reset: () => resetField(name),
      };
    }
    
    return newState;
  }, [formState, handleChange, handleBlur, resetField]);
  
  // Check if the form is valid
  const isValid = useMemo(() => {
    return Object.values(formStateWithHandlers).every((field) => !field.error);
  }, [formStateWithHandlers]);
  
  // Check if the form is dirty (any field has been touched)
  const isDirty = useMemo(() => {
    return Object.values(formStateWithHandlers).some((field) => field.touched);
  }, [formStateWithHandlers]);
  
  // Function to reset the entire form
  const reset = useCallback(() => {
    const newState: FormState = {};
    
    for (const [name, fieldConfig] of Object.entries(config)) {
      newState[name] = {
        ...formState[name],
        value: fieldConfig.initialValue,
        error: null,
        touched: false,
      };
    }
    
    setFormState(newState);
  }, [config, formState]);
  
  // Function to set a field value programmatically
  const setFieldValue = useCallback((name: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
      },
    }));
  }, []);
  
  // Function to set a field error programmatically
  const setFieldError = useCallback((name: string, error: string | null) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        error,
      },
    }));
  }, []);
  
  // Function to get all form values
  const getValues = useCallback(() => {
    const values: Record<string, any> = {};
    
    for (const [name, field] of Object.entries(formStateWithHandlers)) {
      values[name] = field.value;
    }
    
    return values;
  }, [formStateWithHandlers]);
  
  // Function to handle form submission
  const handleSubmit = useCallback((onSubmit: (values: Record<string, any>) => void) => {
    // First, validate all fields
    const newState = { ...formState };
    let hasErrors = false;
    
    for (const [name, fieldConfig] of Object.entries(config)) {
      if (fieldConfig.validate) {
        const error = fieldConfig.validate(formState[name].value);
        newState[name] = {
          ...formState[name],
          error,
          touched: true,
        };
        
        if (error) {
          hasErrors = true;
        }
      }
    }
    
    setFormState(newState);
    
    // If no errors, call the submit handler
    if (!hasErrors) {
      const values = getValues();
      onSubmit(values);
    }
  }, [config, formState, getValues]);
  
  const isFormValid = useCallback(() => {
    // Check if all fields have values and no errors
    return Object.values(formStateWithHandlers).every(
      field => field.value.trim() !== '' && field.error === null
    );
  }, [formStateWithHandlers]);
  
  return {
    formState: formStateWithHandlers,
    handleSubmit,
    isValid,
    isDirty,
    reset,
    setFieldValue,
    setFieldError,
    getValues,
    isFormValid,
  };
} 