import React, {useEffect, useState} from 'react';
import FormikField from './../components/FormikField/index'
import DatePickerBox from './../components/DatePickerBox/DatePickerBox'
import NumberBox from './../components/NumberBox/NumberBox';
import { Formik, Form } from 'formik';
import { 
    ListItemText, 
    Input,
    Checkbox,
    Select,
    FormControl,
    FormControlLabel,
    MenuItem
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ErrorAlert from './../components/ErrorAlert/index';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import api from './../api';

import './Cadastro.scss';

let data = new Date();
    const hoje = (data.getFullYear() + "-" + ((data.getMonth() + 1)) + "-" + (data.getDate())).toString();

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

const initialValues = {
    nomeChurras: '',
    descricao: '',
    data: hoje,
    obsAdd: '',
    valorTotal: undefined!
}

const validationSchema = Yup.object().shape({
    nomeChurras: Yup.string().required('Nome do churras é obrigatório'),
    descricao: Yup.string().required('Descrição é obrigatória').max(140, 'Máximo 140 caracteres!'),
    valorTotal: Yup.mixed().required('Valor total é obrigatório')

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
    const [datepicker, setDatepicker] = useState<string>('');
    const [stateValorTotal, setStateValorTotal] = useState<number>(null!);
    const [observacoesAdicionais, setObservacoesAdicionais] = useState<boolean>(false);
    const [modalAlertErro, setModalAlertErro] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const [datePickerErrorMessage, setDatePickerErrorMessage] = useState<boolean>(false);

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
        console.log('entrei')
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
                                            <DatePickerBox
                                                size='small'
                                                name='data'
                                                value={datepicker}
                                                errorMessage={datePickerErrorMessage === true ? 'Data do churras é obrigatória' : undefined}
                                                onChangeCallback={(e: any) => {
                                                    formikProps.setFieldValue('data', e.target.value)
                                                    setDatepicker(e.target.value);
                                                    setDatePickerErrorMessage(false)
                                                }}
                                            />
                                        </div>
                                        <div className='cadastro-valorTotal'>
                                            <div className='cadastro-form-label'>Valor Total</div>
                                            <NumberBox
                                                name='valorTotal'
                                                prependText={'R$'}
                                                value={stateValorTotal}
                                                onChangeCallback={(e: any) => {
                                                    formikProps.setFieldValue('valorTotal', e.target.value)
                                                    setStateValorTotal(e.target.value)
                                                }}
                                            />
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
                                        <button className='btn-entrar' type='submit' onClick={() => {datepicker === '' && setDatePickerErrorMessage(true)}}>
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