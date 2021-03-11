import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config'
import firebase from 'firebase'

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookID:'',
        scannedStudentID:'',
        buttonState: 'normal',
        transactionMessage:''
      }
    }

    getCameraPermissions = async (ID) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: ID,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const buttonState=this.state.buttonState
      if(buttonState==='bookID'){
        this.setState({
          scanned: true,
          scannedBookID:data,
          buttonState: 'normal'
        });
      }
      if(buttonState==='studentID'){
        this.setState({
          scanned: true,
          scannedStudentID:data,
          buttonState: 'normal'
        });
      }
    }
    initiateBookIssue=async()=>{
      db.collection('transactions').add({
        'studentID':this.state.scannedStudentID,
        'bookID':this.state.scannedBookID,
        'transactionType':'issued',
        'date':firebase.firestore.Timestamp.now().toDate()
      })
      db.collection('books').doc(this.state.scannedBookID).update({
        'bookAvailability':false
      })
      db.collection('students').doc(this.state.scannedStudentID).update({
        'booksIssued':firebase.firestore.FieldValue.increment(1)
      })
      alert('Book Issued')
      this.setState({
        scannedBookID:'',
        scannedStudentID:''
      })
    }

    initiateBookReturn=async()=>{
      db.collection('transactions').add({
        'studentID':this.state.scannedStudentID,
        'bookID':this.state.scannedBookID,
        'transactionType':'returned',
        'date':firebase.firestore.Timestamp.now().toDate()
      })
      db.collection('books').doc(this.state.scannedBookID).update({
        'bookAvailability':true
      })
      db.collection('students').doc(this.state.scannedStudentID).update({
        'booksIssued':firebase.firestore.FieldValue.increment(-1)
      })
      alert('Book Returned')
      this.setState({
        scannedBookID:'',
        scannedStudentID:''
      })
    }

    handleTransaction=async()=>{
var transactionMessage
db.collection('books').doc(this.state.scannedBookID).get()
.then((doc)=>{
var book=doc.data()
if(book.bookAvailability===true){
this.initiateBookIssue()
transactionMessage='Book Sucessfully Issued'
}else{
  this.initiateBookReturn()
  transactionMessage='Book Sucessfully Returned' 
}
})
this.setState({transactionMessage:transactionMessage})
    }
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== 'normal' && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>

         <View>
           {/* <Image source={require('../assets/favicon.png')} style={{width:200, height:200}}/> */}
         </View>
          <View>
            <TextInput placeholder='Book ID' value={this.state.scannedBookID}/>

            
            <TouchableOpacity
            onPress={this.getCameraPermissions('bookID')}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
          </View>
          <View>
          <TextInput placeholder='Student ID' value={this.state.scannedStudentID}/>

          
          <TouchableOpacity
            onPress={this.getCameraPermissions('studentID')}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>{
            this.handleTransaction()
          }}> <Text>Submit</Text></TouchableOpacity>
        </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    }
  });