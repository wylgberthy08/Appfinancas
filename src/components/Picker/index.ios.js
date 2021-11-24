import React from 'react';
import {Picker as RNPickerSelected} from '@react-native-picker/picker';

import {PickerView} from './styles';

export default function Picker({onChange, tipo}) {
 return (
   <PickerView>
     <RNPickerSelected
       style={{
           width: '100%',
       }}
       selectedValue={tipo}
       onValueChange={ (valor) => onChange(valor)}     
     > 
      <RNPickerSelected.Item label="Receita" value="receita"/>
      <RNPickerSelected.Item label="Despesa" value="despesa"/>

     </RNPickerSelected>
   </PickerView>
  );
}