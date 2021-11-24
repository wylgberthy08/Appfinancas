import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import  Icon from 'react-native-vector-icons/Feather';

import {Container, Tipo, IconView, TipoText, ValorText, Nome} from './styles'

export default function HistoricoList({data, deleteItem}) {
 return (
  <TouchableWithoutFeedback onLongPress={()=> deleteItem(data)}>  
   <Container>
       <Tipo>
           <IconView tipo={data.tipo}>
               <Icon
                name={data.tipo === 'despesa' ? 'arrow-down' : 'arrow-up'}
                color="#fff"
                size={20}/>
               <TipoText>{data.tipo}</TipoText>
           </IconView>
       </Tipo>
       <Nome>
           {data.descricao}
       </Nome>
       <ValorText>
          R$ {data.valor}
       </ValorText>
   </Container>
   </TouchableWithoutFeedback> 
  );
}