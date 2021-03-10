import React from 'react';
import TextField from '@material-ui/core/TextField';
import {ErrorMessage, Field} from 'formik';
import { MinimunEventCallBack } from "../../utils/commonProps";

import './formikField.scss';

interface IFormikFieldProps {
    label: string,
    name: string,
    type?: string,
    value: any,
    onChangeCallback?: MinimunEventCallBack
}

const FormikFieldArray: React.FC<IFormikFieldProps> = ({label, value, name, type = 'text', onChangeCallback = null!} ) => {
    return(
        <div className='FormikField'>
            <Field
                as={TextField}
                value={value}
                variant='outlined'
                name={name}
                label={label}
                type={type}
                onChangeCallback={onChangeCallback}
                helperText={<ErrorMessage name={name}/>}
            />
        </div>
    )
}

export default FormikFieldArray;