import React from 'react';
import { FormHelperText, FormControlLabel, FormControl, Checkbox } from '@material-ui/core';
import {ErrorMessage, Field, FieldInputProps} from 'formik';

import './formikCheckBox.scss';


interface IFormikFieldProps {
    label: string,
    name: string,
    onChange?: any,
    value?: any
}

interface ICheckBoxGroup extends FieldInputProps<any> {
    name: string,
    value: any,
    label: string,
    errorString?: string
}

const CheckBox: React.FC<ICheckBoxGroup> = ({name, errorString, label, value, onBlur, onChange}) => {

    return (
        <FormControl >
            <FormControlLabel
                control={
                    <>
                        <Checkbox
                            checked={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            name={name}
                            color="primary"
                            value={value}
                        />
                    </>
                }
                label={label}
            />
            <FormHelperText>{errorString}</FormHelperText>
        </FormControl>
    )
}

const FormikCheckbox: React.FC<IFormikFieldProps> = ({label, name, onChange} ) => {
    return(
        <div className='FormikCheckBox'>
            <Field
                as={CheckBox}
                name={name}
                label={label}
                type="checkbox"
                onChange={onChange}
                errorString={<ErrorMessage name={name} />}
            />
        </div>
    )
}

export default FormikCheckbox;