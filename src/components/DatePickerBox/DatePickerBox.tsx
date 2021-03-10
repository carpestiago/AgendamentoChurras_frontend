import React from "react";
import { parseISO, formatISO, parse } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { MinimunEventCallBack } from "../../utils/commonProps";

import "./DatePickerBox.scss";


export interface IDatePickerBoxProps {
    /** Nome. */
    name?: string
    /** Label. */
    label?: string
    /** Placeholder. */
    placeholder?: string
    /** Valor selecionado. */
    value?: string,
    /** Impede que o usuário interaja com o componente. */
    readOnly?: boolean,
    /** Define se o componente está desabilitado. */
    disabled?: boolean,
    /** Mensagem de erro. */
    errorMessage?: string,
    size?: any,
    /** onChangeCalback. */
    onChangeCallback?: MinimunEventCallBack
    /** onBlurCallback. */
    onBlurCallback?: MinimunEventCallBack
}

/**
 * DatePickerBox
 */
export const DatePickerBox = React.forwardRef(({
    name = "",
    label = "",
    placeholder = "",
    readOnly = false,
    disabled = false,
    value = null!,
    errorMessage = "",
    size="medium",
    onChangeCallback = null!,
    onBlurCallback = null!
}: IDatePickerBoxProps, ref: any) => {

    const isInvalid = (errorMessage?.trim()?.length > 0);

    const handleEvents = (newDate?: Date, inputValue?: any, method?: MinimunEventCallBack) => {
        let value = null;

        try
        {
            const dateFromValue = parse(inputValue, "dd/MM/yyyy", new Date());
            value = formatISO(dateFromValue);
        }
        catch { }

        const dataToSend = {
            target: {
                name,
                id: name,
                value
            }
        };

        if (method) method(dataToSend);

    };

    const valueAsDate = parseISO(value);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale} >
            <KeyboardDatePicker
                className="date-picker-box"
                id={name}
                name={name}
                label={label}
                placeholder={placeholder}
                inputRef={ref}
                value={valueAsDate}
                disabled={disabled}
                readOnly={readOnly}
                error={isInvalid}
                helperText={(isInvalid && errorMessage)}
                onChange={(date:any, value:any) => handleEvents(date, value, onChangeCallback)}
                onBlur={(e) => handleEvents(null!, e.target.value, onBlurCallback)}
                // disableToolbar
                // variant="inline"
                format="dd/MM/yyyy"
                inputVariant="outlined"
                size={size}
                // KeyboardButtonProps={{
                //     'aria-label': 'change date',
                // }}
            />
        </MuiPickersUtilsProvider>
    )
});

export default DatePickerBox;
