import React, {useEffect, useState} from 'react';
import {ReactComponent as MembersIcon} from './../resources/icon_people.svg'
import {ReactComponent as BudgetIcon} from './../resources/icon_money.svg'
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import { Checkbox } from '@material-ui/core';
import { parseISO, format } from "date-fns";
import { useHistory } from 'react-router-dom';
import api from './../api';

import './Detalhes.scss';


interface IConvidado {
    valorArrecadado: number,
    nomeParticipante: string,
    pago: boolean,
    bebida: boolean
}

export default function Detalhes(props: any) { 
    let history = useHistory();

    const detalhesData = props.location.state
    const [stateDetalhes, setStateDetalhes] = useState<any>(null);
    const [listaChurras, setChurras] = useState<any>(null!);
    const [stateBebidas, setStateBebidas] = useState<any[]>([])
    const [stateValorArrecadado, setStateValorArrecadado] = useState<number[]>([])
    const [valorArrecadado, setValorArrecadado] = useState<number>(null!)
    const mostraDeDateISOparaDataPtBr = (value: string, formatPadrao: string = "dd/MM"): string => format(parseISO(value), formatPadrao);

    useEffect(() => {
        setStateDetalhes(detalhesData);
    }, [])

    useEffect(() => {
        const buscaChurras = async () => {
            const idChurras = detalhesData && detalhesData;

            await api.get<any>(`/buscaChurras/${idChurras}`).then(res => {
                if(res.data) {
                    const churras = res.data
                    setChurras(churras)
                    
                }              
            })
        }

        buscaChurras();
    },[])
    
    useEffect(() => {
        const filter = stateValorArrecadado.filter(function (element) {
            return element !== undefined
        })

        const valorFinal = filter.reduce((soma, item) => soma + item, 0)

        setValorArrecadado(valorFinal)
        
    }, [stateValorArrecadado])
    
    const formatCurrency = (value:number) => new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value)
    
    function openPage() {
        history.push({pathname: '/agenda'})
    }

    const galeraChurras = listaChurras && listaChurras.participantes;

    return (
        listaChurras && listaChurras !== undefined && listaChurras !== null &&
        
        <div className='detalhes-page'>
            <div className='background-image'/>
                <div className='detalhes-title'>Agenda de Churras</div>
                <div className='detalhes-box-cards'>      
                    <div className='box-infos'>
                        <div className='container-date-icon'>
                            <div className='date-bbq'>{mostraDeDateISOparaDataPtBr(listaChurras.data)}</div>
                            <div>
                                <MembersIcon />
                                {listaChurras.participantes.length}
                            </div>
                        </div>
                        <div className='container-name-budget-icon'>
                            <div className='name-bbq'>{listaChurras.nomeChurras}</div>
                            <div className='icon-budget'>
                                <BudgetIcon />
                            </div>
                                R$ {listaChurras.valorTotal}
                        </div>
                        <div className='title-bbq'>Descrição</div>
                        <div className='content-bbq'>
                            {listaChurras.descricao}
                        </div>
                        <div className='title-bbq'>Observação adicional</div>
                        <div className='content-bbq'>
                            {listaChurras.obsAdd}
                        </div>
                    </div>
                    <div className='box-members'>
                        <div className='title-description-bbq'>Participantes e valores</div>
                            <div className='container'>

                            { listaChurras && listaChurras !== undefined && listaChurras !== null &&
                            
                                galeraChurras.map((convidado: IConvidado, index: number) => {
                                    return (
                                        <div className='row'>
                                            <div className='column column-checkbox'>
                                                <Checkbox
                                                    icon={<CircleUnchecked className='checkbox-icon' />}
                                                    checkedIcon={<CircleCheckedFilled />}
                                                    key={convidado.nomeParticipante}
                                                    checked={convidado.pago}
                                                    value={convidado.pago}
                                                    name={convidado.nomeParticipante}
                                                    disabled={convidado.pago === true && true}
                                                    color='primary'
                                                    onClick={(event: any) => {
                                                        let stateAux = {...listaChurras}

                                                        stateAux.participantes[index].pago = event.target.checked
                                                        setChurras(stateAux)

                                                        if(event.target.checked === true) {
                                                            let stateAuxValorTotal = [...stateValorArrecadado]

                                                            stateAuxValorTotal[index] = stateAux.participantes[index].valorArrecadado;
                                                            setStateValorArrecadado(stateAuxValorTotal)

                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className={`column column-name ${convidado.pago === true && 'line-through'}`}>
                                                {convidado.nomeParticipante}
                                            </div>
                                            <div className='column column-checkboxBebida '>
                                                <Checkbox
                                                    disabled={convidado.pago === true}
                                                    key={convidado.nomeParticipante}
                                                    checked={convidado.bebida }
                                                    value={convidado.bebida}
                                                    name={convidado.nomeParticipante}
                                                    color='primary'
                                                    onClick={(event: any) => {
                                                        let stateAux = {...listaChurras}

                                                        stateAux.participantes[index].bebida = event.target.checked
                                                        setChurras(stateAux)

                                                        if(event.target.checked === true) {
                                                            let stateAuxValorBebida = {...listaChurras}

                                                            stateAuxValorBebida.participantes[index].valorArrecadado = stateAuxValorBebida.participantes[index].valorArrecadado*2;
                                                            setStateBebidas(stateAuxValorBebida)
                                                        } else {
                                                            let stateAuxValorBebida = {...listaChurras}

                                                            stateAuxValorBebida.participantes[index].valorArrecadado = stateAuxValorBebida.participantes[index].valorArrecadado/2;
                                                            setStateBebidas(stateAuxValorBebida)
                                                            
                                                        }
                                                    }}
                                                />
                                                <div className={`${convidado.pago === true && 'line-through'} label-checkbox`} >
                                                    Com bebida
                                                </div>
                                            </div>
                                            <div className={`column column-budget ${convidado.pago === true && 'line-through'}`}>
                                                R${formatCurrency(convidado.valorArrecadado)}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        <div className='box-budget'>
                                <div className='text-budget'>Valor arrecadado: </div>
                                <BudgetIcon /> R${ valorArrecadado !== null  ? formatCurrency(valorArrecadado) : 0 }
                        </div>
                        <div className='container-btn'>
                            <button className='btn-entrar' onClick={openPage}>
                                Voltar
                            </button>
                        </div>                     
                    </div>
                </div>
                <div>
            </div> 
        </div>
    )
}