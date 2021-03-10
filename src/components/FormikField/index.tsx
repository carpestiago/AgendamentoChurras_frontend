import React from 'react';
import {ErrorMessage, Field} from 'formik';
import TextField from '@material-ui/core/TextField';

import './formikField.scss';

interface IFormikFieldProps {
    label?: string,
    name: string,
    type?: string,
    disabled?: boolean,
    value?: any,
    placeholder?: string
}

const FormikField: React.FC<IFormikFieldProps> = ({label, name, type = 'text', disabled = false, value, placeholder} ) => {
    return(
        <div className='FormikField'>
            <Field
                as={TextField}
                variant='outlined'
                value={value}
                name={name}
                label={label}
                type={type}
                disabled={disabled}
                size='small'
                helperText={<ErrorMessage name={name}/>}
                placeholder={placeholder}
            />
        </div>
    )
}

export default FormikField;