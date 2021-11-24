import React, {useState, useContext} from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import {format} from 'date-fns';
import {AuthContext} from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Picker from '../../components/Picker';
import {Background, Input, SubmitButton, SubmitText} from './styles';

export default function New() {
  const navigation = useNavigation();
    
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('')
  const [tipo, setTipo] = useState('receita');

  const {user:usuario} = useContext(AuthContext);

  function handleSubmit(){
    Keyboard.dismiss();
    if(isNaN(parseFloat(valor)) || descricao === '' || tipo === null){
        alert('Preencha todos os campos!');
        return;
    }
    
    Alert.alert(
        'Confirmando dados',
        `Tipo ${tipo} - Valor: ${parseFloat(valor)} - Descrição: ${descricao}`,

        [
            {
                text:'Cancelar',
                style:'cancel'
            },
            {
                text: 'Continuar',
                onPress: () => handleAdd()
            }
        ]
    )

  }

 async function handleAdd(){
  let uid = usuario.uid;

  let key = await firebase.database().ref('historico').child(uid).push().key;

  await firebase.database().ref('historico').child(uid).child(key).set({
      valor:parseFloat(valor),
      tipo:tipo,
      descricao:descricao,
      date:format(new Date(), 'dd/MM/yyyy')
  })

  //atualizando o saldo
  let user = firebase.database().ref('users').child(uid);
  await user.once('value').then((snapshot)=>{
      let saldo = parseFloat(snapshot.val().saldo);

      tipo === 'despesa' ? saldo -= parseFloat(valor) : saldo += parseFloat(valor);
      
      user.child('saldo').set(saldo);
  })
   
  Keyboard.dismiss();
  setValor('');
  navigation.navigate('Home');

  }
 return (

  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
   <Background>
       <Header/>

       <SafeAreaView style={{alignItems:'center'}}>
           <Input
            placeholder="Valor Desejado"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={()=> Keyboard.dismiss()}
            value={valor}
            onChangeText={(text) => setValor(text)}
           />
           <Input
            placeholder="Descrição"
            returnKeyType="next"
            value={descricao}
            onChangeText={(text) => setDescricao(text)}
           />  
             
          
           <Picker onChange={setTipo} tipo={tipo}/>

           <SubmitButton onPress={handleSubmit}>
               <SubmitText>Registrar</SubmitText>
           </SubmitButton>
       </SafeAreaView>
   </Background>
   </TouchableWithoutFeedback>

  );
}