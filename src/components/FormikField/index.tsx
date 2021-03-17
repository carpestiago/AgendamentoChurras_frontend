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
    placeholder?: string,
    multiline?: boolean,
    rows?: number,
    className?: string
}

const FormikField: React.FC<IFormikFieldProps> = ({label, className, name, type = 'text', disabled = false, value, placeholder, multiline = false, rows} ) => {
    return(
        <div className='FormikField'>
            <Field
                className={className}
                as={TextField}
                variant='outlined'
                multiline={multiline}
                rows={rows}
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