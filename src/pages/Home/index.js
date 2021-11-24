import React, {useContext, useState, useEffect} from 'react';
import {Alert, Platform, TouchableOpacity} from 'react-native'
import firebase from '../../services/firebaseConnection';
import {format, isBefore } from 'date-fns';

import HistoricoList from '../../components/HistoricoList';
import Header from '../../components/Header';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

import {AuthContext} from '../../contexts/auth';

import {Background, Container, Nome, Saldo, Title, List, Area} from './styles';
import { onChange } from 'react-native-reanimated';

export default function Home() {
 const [historico, setHistorico] = useState([]);
 const [saldo, setSaldo] = useState(0);

  const {user} = useContext(AuthContext);
  let uid = user && user.uid;

  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);
 
  useEffect(()=>{
    async function loadList(){
      //buscando saldo do usuario
      await firebase.database().ref('users').child(uid).on('value', (snapshot)=>{
        setSaldo(snapshot.val().saldo);
      });
      
      //buscando dados do usuario para renderizar nos cards de gastos
      await firebase.database().ref('historico')
      .child(uid)
      .orderByChild('date').equalTo(format(newDate, 'dd/MM/yyyy'))
      .limitToLast(10).on('value', (snapshot)=>{
        setHistorico([]);

        snapshot.forEach((childItem) => {
          let list = {
            key:childItem.key,
            tipo:childItem.val().tipo,
            descricao:childItem.val().descricao,
            valor:childItem.val().valor,
            date:childItem.val().date,
          };

          setHistorico(oldArray => [...oldArray, list].reverse());

        })
      })
    }
    loadList();
 
  },[newDate]);

  function handleDelete(data){
    //pegando data do item
    const [diaItem, mesItem, anoItem ] = data.date.split('/');
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);
    console.log(dateItem);

    //pegando data hoje:
    const formatDiaHoje = format(new Date(), 'dd/MM/yyyy');
    const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split('/');
    const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);
    console.log(dateHoje);


    

     if(isBefore(dateItem, dateHoje)){
       //se a data do registro já passou vai entrar aqui!
       alert('Você não pode excluir um registro antigo!')
       return;
     }
     
     Alert.alert(
       'Cuidado Atenção!',
       `Você deseja excluir ${data.descricao} - ${data.valor}`,
       [
        {
         text:'Cancelar',
         style:'cancel'
        },
        {
          text:'Continuar',
          onPress: ()=>handleDeleteSucess(data)
        } 
      ]
     )

  }

//deletando um registro e atualizando o saldo
 async function handleDeleteSucess(data){
     await firebase.database().ref('historico')
     .child(uid).child(data.key).remove()
     .then( async ()=>{
       let saldoAtual = saldo;
       data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor);

       await firebase.database().ref('users').child(uid)
       .child('saldo').set(saldoAtual);
     })
     .catch((err)=>{
       console.log(err)
     })
  }

  function handleShowPicker(){
    setShow(true);
  }
  
  function handleClose(){
    setShow(false);
  }

  const onChange = (date) => {
    setShow(Platform.OS === 'ios');
    setNewDate(date);
    console.log(date);
  }
 return (
    <Background>
      <Header/>
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
      </Container>
      
      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color="#fff" size={30}/>
        </TouchableOpacity>
        <Title>Ultimas movimentações</Title>
      </Area>
      

      <List
       showsVerticalScrollIndicator={false}
       data={historico}
       keyExtractor={item => item.key}
       renderItem={({item})=>(<HistoricoList data={item} deleteItem={handleDelete}/>)}  
      />
       {show && (
         <DatePicker
          onClose={handleClose}
          date={newDate}
          onChange={onChange}
         />
       )}
    </Background>
  );
}