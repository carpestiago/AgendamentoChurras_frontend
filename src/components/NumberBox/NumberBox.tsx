import React from "react";
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import MaskedInput from 'react-text-mask'
import { TextField, InputAdornment } from "@material-ui/core";
import {ErrorMessage, Field} from 'formik';
import { MinimunEventCallBack } from "./../../utils/commonProps";

import "./../../utils/commonProps";
import "./NumberBox.scss";

export interface INumberBoxProps {
    /** Tipo de elemento de entrada. Deve ser um tipo de entrada HTML5 válido. **Atenção:** ver nota no topo dessa documentação a respeito do uso de tipos nessa propriedade. */
    type?: string
    /** Nome. */
    name: string
    /** Label. */
    label?: string
    /** Placeholder. */
    placeholder?: string
    /** Valor selecionado. */
    value?: number,
    /** Define um valor mínimo a ser inserido. */
    minValue?: number
    /** Define um valor máximo a ser inserido. */
    maxValue?: number
    /** Define se o componente está desabilitado. */
    disabled?: boolean
    /** Mensagem de erro. */
    errorMessage?: string
    /** Exibe zero após a vírgula. */
    afterCommaAlwaysZero?: boolean
    /** Impede números após a vírgula. */
    noDecimalValue?: boolean
    /** Define um tamanho máximo para o valor. Considera inclusive números após a vírgula. */
    integerLimit?: number
    /** Insere um caractere após a área de input do componente. Por exemplo: %. */
    appendText?: string
    /** Insere um caractere antes da área de input do componente. Por exemplo: $. */
    prependText?: string
    size?: any
    /** onChangeCalback. */
    onChangeCallback?: MinimunEventCallBack
    /** onBlurCallback. */
    onBlurCallback?: MinimunEventCallBack
}

export const NumberBox = React.forwardRef(({
    type = "text",
    name = "",
    label = "",
    placeholder = "",
    value = null!,
    minValue = 0,
    maxValue = null!,
    disabled = false,
    errorMessage = null!,
    afterCommaAlwaysZero = false,
    noDecimalValue = false,
    integerLimit = 7,
    appendText = "",
    prependText = "",
    size = "medium",
    onChangeCallback = null!,
    onBlurCallback = null!
}: INumberBoxProps, ref) => {

    const getBeforeCommaValues = (_value: number): number => {
        let strValue = _value.toString();

        if (strValue.indexOf(".") > -1) {
            // remove tudo depois da vírgula
            strValue = strValue.substr(0, strValue.indexOf("."));
            return getNumberFromValueString(strValue);
        }
        // retorna como veio
        return _value;
    }

    const handleMaxValue = (_value: number, valueIfError: number): number => {
        if (maxValue && maxValue < _value) {
            return valueIfError;
        }
        return _value;
    }

    const handleMinValue = (_value: number, valueIfError: number): number => {
        if (minValue && minValue > _value) {
            return valueIfError;
        }
        return _value;
    }

    const getNumberFromValueString = (_value: string): number => {
        if (_value.trim().substr(_value.trim().length-1, 1) === ",")
            return NaN;
        
        return _value.trim().length === 0 ? null! : Number(_value.replace(/\./g, "").replace(/,/g, "."));
    }

    const isInvalid = (errorMessage?.trim()?.length > 0);

    const defaultMaskOptions = {
        prefix: '',
        suffix: '',
        // includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
        allowDecimal: true,
        decimalSymbol: ',',
        decimalLimit: 2,
        integerLimit: 7, // limit length of integer numbers
        requireDecimal: true,
        allowNegative: false,
        allowLeadingZeroes: false,
    }

    const numberMask = createNumberMask(defaultMaskOptions);

    //converte o value de javascript formato 128.45 para 128,45
    //  para a mask ser aplicada corretamente
    let cvalue: any = value;
    
    if (cvalue) {
            // if (afterCommaAlwaysZero) {
            //     cvalue = getBeforeCommaValues(cvalue);
            //     cvalue = `${cvalue.toString()},00`;
            // }
        
        return cvalue = cvalue.toString().replace(/\./g, ",00");
    }

    return (
        <MaskedInput 
            mask={numberMask} 
            value={cvalue}
            onBlur={(e) => {
                let _value:any = getNumberFromValueString(e.target.value);
                
                if (minValue || maxValue) {
                    // validação no Onblur...
                    //  se o valor não respeita os limites, restaura o valor do limite estourado
                    _value = handleMaxValue(_value, maxValue);
                    _value = handleMinValue(_value, minValue);
    
                    if (_value !== value) {
                        e.target.value = _value ? (value ?? "").toString().replace(/\./g, ",") : _value;

                        if (onChangeCallback) {
                            onChangeCallback({
                                target: {
                                    id: name,
                                    name: name,
                                    value: _value
                                }
                            });
                        }
                    }
                }
                if (onBlurCallback) {
                    onBlurCallback({
                        target: {
                            id: name,
                            name: name,
                            value: _value
                        }
                    });
                }
            }}
            onChange={(e) => {
                let _value = getNumberFromValueString(e.target.value);

                if (isNaN(_value)) {
                    // algum valor inválido com número, como "125,"
                    // no entanto, tem que permitir a digitação do resto
                }
                else {
                    if (onChangeCallback) {
                        onChangeCallback({
                            target: {
                                id: name,
                                name: name,
                                value: _value
                            }
                        });
                    }
                }
            }}
            render={
                (ref, inputProps) => 
                <Field 
                    as={TextField}
                    className="currency-box"
                    type={type}
                    id={name}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    inputRef={ref}
                    disabled={disabled}
                    error={isInvalid}
                    helperText={<ErrorMessage name={name}/>}
                    size={size}
                    variant="outlined"
                    InputProps={{
                        endAdornment: (appendText ?? false) && <InputAdornment position="end">{appendText}</InputAdornment>,
                        startAdornment: (prependText ?? false) && <InputAdornment position="start">{prependText}</InputAdornment>
                      }
                    }
                    { ...inputProps }
                />
            }
        />
    )
});

export default NumberBox;