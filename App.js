/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { ToWords } from 'to-words';
import currencies from './src/data/currencies';
// import exchange from './src/exchange';

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    // currency: true,
    ignoreDecimal: false,
    // ignoreZeroCurrency: false,
    // doNotAddOnly: false,
  }
});

var exchangeData = null;

const App = () => {

  var txtInputAmount = useRef(null);
  var [targetCurrency, setTargetCurrency] = useState('');
  var [convertedAmount, setConvertedAmount] = useState(null);
  var [currencyOptions, setCurrencyOptions] = useState([]);
  var [inputWords, setInputWords] = useState('');
  var [outputWords, setOutputWords] = useState('');
  var [inputValue, setInputValue] = useState();
  var [formattedInput, setFormattedInput] = useState();
  
  const fetchData = (inputAmount) => {
    fetch('https://currencyapi.com/api/v2/latest?apikey=0bbbb6a0-8958-11ec-98c5-296619e599cd')
      .then(response => response.json())
      .then(data => {
        if(data['data']) {
          exchangeData = data['data'];
          initCurrencyOptions();
        }
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    fetchData();
  },[]);

  useEffect(() => {
    inputValue && doConversion(inputValue);
  },[targetCurrency])

  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

  const initCurrencyOptions = () => {
    var defaultIndex;
    var codes = Object.keys(exchangeData);

    // Map currency codes to full currency names 
    var fullNames = codes.map((code,index) => {
      var currency = currencies.find((currencyObj) => {
        return code === currencyObj.cc
      });

      // Save index for AUD to make it selected by default
      code === 'AUD' && (defaultIndex = index);

      return currency? `${code}: ${currency.name}` : code;
    });
    setCurrencyOptions(fullNames);

    // Set default target currency (AUD by default or or first one if AUD not found)
    setTargetCurrency(fullNames[defaultIndex || 0]);
  }

  const doConversion = (inputAmount) => {
    if(exchangeData) {
      // Get currency code from full name
      var code = targetCurrency.split(':')[0];
      var exchangeRate = exchangeData[code];
      var converted = (+inputAmount * exchangeRate).toFixed(2);
      setConvertedAmount(addCommas(converted));
      setOutputWords(toWords.convert(converted));
    }
  }

  const onInputChange= (value) => {
    if(value) {
      var v = removeNonNumeric(value);
      setInputValue(v);
      doConversion(v);
      setInputWords(toWords.convert(v));
      setFormattedInput(addCommas(v));
    } else{
      setInputValue();
      setFormattedInput('');
      setConvertedAmount('');
      setInputWords('');
      setOutputWords('');
    }
  }

  const onTargetChange = (index, value) => {
    setTargetCurrency(value);
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
      style={{height:'100%'}}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.currencyWrapper}>
          <View style={styles.currecnyBox}>
            <TextInput value={formattedInput} style={[styles.input, styles.amountFont]} keyboardType='decimal-pad' onChangeText={onInputChange} ref={txtInputAmount}></TextInput>
            <Text style={styles.currencyLbl}>US Dollar (USD)</Text>
          </View>
          <Text style={styles.wordsAmount}>{inputWords}</Text>
          <Text style={{fontSize: 20}}>=</Text>
          <View style={[styles.currecnyBox]}>
            <View style={[styles.input, { alignItems: 'center', justifyContent: 'center'} ]}>
              <Text style={styles.amountFont}>{convertedAmount}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <ModalDropdown
                  style={[styles.currencyLbl, {width: '80%'}]}
                  textStyle={{color: '#000', fontSize: 16}}
                  dropdownTextStyle={{fontSize: 16}}
                  isFullWidth={true}
                  defaultValue={targetCurrency}
                  options={currencyOptions}
                  onSelect={onTargetChange}
              />
              {/* <View style={[styles.currencyWrapper, styles.currencyLbl]}>
                <Text>{targetCurrency}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>{'V'}</Text>
              </View> */}
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'gray', textAlign: 'center'}}>v</Text>
            </View>
          </View>
          <Text style={styles.wordsAmount}>{outputWords}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  currencyWrapper: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  currecnyBox: {
    flex: 1,
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    marginHorizontal: 10,
    marginTop: 20,
  },
  input: {
    marginTop: 20, width: '70%', height: 50, paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#a0a0a0', borderWidth: 1,
  },
  amountFont: {fontSize: 20, color: '#000', textAlign: 'center',},
  currencyLbl: { marginTop: 20, marginBottom: 15 },
  wordsAmount: {
    marginVertical: 20, marginHorizontal: 10, width: '50%', color: 'black', fontSize: 15
  }
});

export default App;
