import React, {useEffect, useState} from 'react';
import FormikField from './../components/FormikField/index'
import { 
    ListItemText, 
    Input,
    Checkbox,
    Select,
    FormControl,
    FormControlLabel,
    MenuItem
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DateFnsUtils from '@date-io/date-fns';
import { format, formatISO } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import IntlCurrencyInput from "react-intl-currency-input"
import ErrorAlert from './../components/ErrorAlert/index';
import { useHistory } from 'react-router-dom';
import api from './../api';

import './Cadastro.scss';


class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date: any) {
      return format(date, "d MMM yyyy", { locale: this.locale });
    }
}

const hoje = new Date();

export interface IFormikSelectItem {
    label: string,
    value: any,
    title?: string
}

interface ICadastroForm {
    nomeChurras: string,
    descricao: string,
    data: string,
    valorTotal: number,
    obsAdd: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

const currencyConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
};

const initialValues = {
    nomeChurras: '',
    descricao: '',
    data: format(new Date(hoje), "yyy-MM-dd"),
    obsAdd: '',
    valorTotal: undefined!
}

const validationSchema = Yup.object().shape({
    nomeChurras: Yup.string().required('Nome do churras é obrigatório'),
    descricao: Yup.string().required('Descrição é obrigatória').max(140, 'Máximo 140 caracteres!')
})

export default function Cadastro(props: any) {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            },
        },
    };

    let history = useHistory();
    const classes = useStyles();

    const [convidados, setConvidados] = useState<string[]>([]);
    const [listaUsuarios, setUsuarios] = useState<string[]>([]);
    const [datepicker, setDatepicker] = useState<any>(hoje);
    const [stateValorTotal, setStateValorTotal] = useState<string>('');
    const [observacoesAdicionais, setObservacoesAdicionais] = useState<boolean>(false);
    const [modalAlertErro, setModalAlertErro] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const [valorTotalErrorMessage, setValorErrorMessage] = useState<boolean>(false);

    useEffect(() => {
        const getListaUsuarios = async () => {
            await api.get<any>('/buscaUsuarios').then(res => {
            if(res.data) {
                setUsuarios(res.data)

            }},(err) => {
                setModalAlertErro(true);
            });
        }

        getListaUsuarios()
    }, [])

    const handleSubmit = (values: ICadastroForm): void => {
        const part = convidados.length;
        const valorT = values.valorTotal
        const valorIndiv = valorT / part

        var arrayParticipantes = convidados.map((convidado) => {
            return (
                {
                    valorArrecadado: valorIndiv,
                    nomeParticipante: convidado,
                    pago: false,
                    bebida: true

                }
            )
        })

        const formValues = [{participantes: arrayParticipantes, ...values}]

        api.post('/criarChurras', formValues).then(res => {
          if(res.data) {
            history.push({pathname: '/detalhes', state: res.data[0]._id})
    
          }},(err) => {
            setErrorMessage(err.data);
            setModalAlertErro(true);
          
        });
    }

    return (
    <>
        {
            modalAlertErro && 
                <ErrorAlert
                    showAlertErro={setModalAlertErro}
                    text={errorMessage}
                />
        }
        <div className='cadastro-page'>
            <div className='background-image'/>
            <div className='cadastro-title'>Adicionar Churras</div>
            <div className='cadastro-form'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {(formikProps) => {
                        return (
                            <div>
                                <Form className='cadastro-box-cards'>
                                    <div className='cadastro-form-label'>Nome/ Motivo do Churras</div>
                                    <FormikField
                                        className='name-field'
                                        name='nomeChurras'
                                    />
                                    <div className='cadastro-form-label'>Descrição</div>
                                    <FormikField
                                        className='description-field'
                                        placeholder='Máximo 140 caracteres'
                                        name='descricao'
                                        multiline
                                        rows={5}
                                    />
                                    <div className='select-members'>
                                        <FormControl className={classes.formControl}>
                                            <div className='cadastro-form-label'>Participantes</div>
                                            <Select
                                                name='participantes'
                                                variant ='outlined'
                                                displayEmpty
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={convidados}
                                                input={<Input />}
                                                renderValue={(selected) => (selected as string[]).join(', ')}
                                                MenuProps={MenuProps}
                                                onChange={
                                                    (event: React.ChangeEvent<{ value: any }>) => {
                                                        setConvidados(event.target.value as string[]);

                                                    }
                                                }
                                            >
                                                {
                                                    listaUsuarios.map((name: any, index) => ( 
                                                        <MenuItem key={index} value={name.name}>
                                                            <Checkbox 
                                                                key={name.index} 
                                                                checked={convidados.indexOf(name.name)  > -1} 
                                                                color='primary' 
                                                            />
                                                            <ListItemText key={index} primary={name.name} />
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='column-datepicker-valueInput'>
                                        <div>
                                            <div className='cadastro-form-label'>Data do Churras</div>
                                            <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale}>
                                                <KeyboardDatePicker
                                                    name='data'
                                                    inputVariant='outlined'
                                                    disableToolbar
                                                    variant="inline"
                                                    format="d MMM yyyy"
                                                    minDate={hoje}
                                                    margin="normal"
                                                    id="date-picker-inline"
                                                    value={datepicker}
                                                    onChange={(e: any) => {
                                                        setDatepicker(e);

                                                        const valorFormatado = formatISO(e);
                                                        const valorString = valorFormatado.toString();
                                                        formikProps.setFieldValue('data', valorString);
                                                        
                                                    }}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',

                                                    }}
                                                    />
                                            </MuiPickersUtilsProvider>
                                        </div>
                                        <div className='cadastro-valorTotal'>
                                            <div className='cadastro-form-label'>Valor Total</div>
                                            <IntlCurrencyInput
                                                className='number-box'
                                                name='valorTotal'
                                                currency="BRL" 
                                                config={currencyConfig} 
                                                onChange={(e: any, value: any) => {
                                                    let numberValue = parseFloat(value)
                                                    formikProps.setFieldValue('valorTotal', numberValue)
                                                 
                                                    setStateValorTotal(e.target.value)
                                                    stateValorTotal !== '' && setValorErrorMessage(false)
                                                    
                                                }} 
                                            />
                                                <div className='error-div'>{valorTotalErrorMessage === true ? 'O valor do churras é obrigatório' : undefined}</div>
                                            
                                        </div>
                                    </div>
                                    <div className='column-obsAdicionais'>
                                        <FormControlLabel
                                            control={
                                            <Checkbox
                                                checked={observacoesAdicionais}
                                                onChange={(e: any) => {
                                                    setObservacoesAdicionais(!observacoesAdicionais)
                                                }}
                                                name = 'obsAdicionais'
                                                color="primary"
                                                size='medium'
                                                value = {observacoesAdicionais}
                                            />
                                            }
                                            label="Observações adicionais"
                                        />
                                        {
                                            observacoesAdicionais === true &&
                                                <FormikField
                                                    className='obsAdicionais-field'
                                                    name='obsAdd'
                                                    placeholder='Máximo 70 caracteres'
                                                />
                                        }
                                    </div>
                                    <div className='btn-cadastro'>
                                        <button className='btn-entrar' type='submit' onClick={() => {stateValorTotal === '' && setValorErrorMessage(true)}}>
                                            Criar o Churras!
                                        </button>
                                    </div>
                                </Form>                        
                            </div>
                        )
                    }}
                </Formik>
            </div>
        </div>
    </>
  )
}