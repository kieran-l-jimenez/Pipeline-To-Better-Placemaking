import React, { useState, useRef, useEffect, useLayoutEffect, useImperativeHandle } from 'react';
import { View, Modal, TextInput, Switch, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useTheme, Text, Button } from '@ui-kitten/components';
import RNPickerSelect from 'react-native-picker-select';

import { styles } from './dataModal.styles';

export function DetailsModal(props){

    const theme = useTheme();

    //Size responsive variables
    const [containerHeight, setContainerHeight] = useState(0);
    const showOptionsRef = useRef(null);
    
    const [noneSelect, setNoneSelect] = useState(false);
    
    // multi-select useStates
    const [select1, setSelect1] = useState(null);
    const [select2, setSelect2] = useState(null);
    const [select3, setSelect3] = useState(null);
    const [select4, setSelect4] = useState([]);
    const [select5, setSelect5] = useState(null);

    //Details fields
    const [spotsText, spotsOnChangeText] = React.useState(0)
    const [lineNumText, lineNumOnChangeText] = React.useState(0)
    const [loopsText, loopsOnChangeText] = React.useState(0)
    const [costText, costOnChangeText] = React.useState(0)
    const [laneCount, setLaneCount] = React.useState(null)

    //Details Options
    const pavedOptions = [
        { label: 'Paved', value: 1 },
        { label: 'Not Paved', value: 2 },
    ];

    const medianOptions = [
        { label: 'Median', value: 1 },
        { label: 'No Median', value: 2 },
    ];

    const directionOptions = [
        { label: 'One-way', value: 1 },
        { label: 'Two-way', value: 2 },
    ];

    const turnOptions = [
        { label: 'No Turn', value: 1 },
        { label: 'Left Turn', value: 2 },
        { label: 'Right Turn', value: 3 },
    ];
    
    const tollOptions = [
        { label: 'Toll Road', value: 1 },
        { label: 'Not Toll Road', value: 2 },
    ];

    const sendData = async () => {
        let arr = packageData();

        //ADD cancel button
        // there was nothing selected so do not sendData
        // if(arr.length === 0){
        //     // display error
        //     setNoneSelect(true)
        //     return
        // }

        let data = {
            purpose: arr
        }
        // reset modal control for subsequent entires
        setNoneSelect(false);
        // closes the modal (in boundaryTest)
        await props.closeDetails(data);
    }

    const options = [];

    for (let i = 1; i <= 10; i++) {
        options.push({ value: `${i}`, label: `${i}` });
    }


    const ShowOptions = React.forwardRef((props, ref) => {
        const optionsRef = useRef(null);
        
        useLayoutEffect(() => {
            const height = showOptionsRef.current.getHeight() + 135;
            if (containerHeight !== height && !isNaN(height)) {
              setContainerHeight(height);
            }
          }, [showOptionsRef, containerHeight]);
          

        console.log("🚀 ~ file: detailsModal.component.js:41 ~ ShowOptions ~ props.data", props.data);

        // Show options for point, path, or area
        if(props.accessType === "Point") {
            // Show options for bike rack
            if(props.data.description === "Bike Rack") {
                return(
                    <View style={styles.buttonRow}>
                        <Text
                            style={styles.inputLabel}
                        >Bike Spots</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={spotsOnChangeText}
                            value={spotsText}
                            placeholder="0"
                            keyboardType='numeric'
                        />
                    </View>    
                )
            } else if(props.data.description === "Public Transport Stop") {
                return(
                    <View>
                        <View style={styles.buttonRow}>
                            <Text
                                style={styles.inputLabel}
                            >Line Number</Text>
                            <TextInput
                                style={styles.inputField}
                                onChangeText={lineNumOnChangeText}
                                value={lineNumText}
                                placeholder="00"
                                keyboardType='numeric'
                            />
                        </View>    
                        <View style={styles.buttonRow}>
                            <Text
                                style={styles.inputLabel}
                            >Daily Loops</Text>
                            <TextInput
                                style={styles.inputField}
                                onChangeText={loopsOnChangeText}
                                value={loopsText}
                                placeholder="00"
                                keyboardType='numeric'
                            />
                        </View>   
                    </View>

                )
            } else {
                sendData();
                return null
            }
        }
        if(props.accessType === "Path") {
            // Show options for roads
            if(props.data.description === "Main Road" || props.data.description === "Side Road") {
                return(
                    <View style={{height: '250px'}}>
                        <View style={styles.buttonRow}>
                            <Text
                                style={styles.inputLabel}
                            >Number of Lanes</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setLaneCount(value)}
                                items={options}
                                value={laneCount}
                                style={{inputIOS: {fontSize: 16}}}
                            />
                        </View>   
                        <View style={styles.buttonRow}>
                            {pavedOptions.map(option => (
                                <Button  
                                key={option.value}
                                style={styles.button} 
                                onPress={() => {setSelect1(option.value)}}
                                appearance={`${getButtonAppearance(option.value, select1)}`}
                                >
                                    <Text style={styles.backButtonTxt}>{option.label}</Text>
                                </Button>
                            ))}
                        </View>
                        <View style={styles.buttonRow}>
                            {medianOptions.map(option => (
                                <Button  
                                key={option.value}
                                style={styles.button} 
                                onPress={() => {setSelect5(option.value)}}
                                appearance={`${getButtonAppearance(option.value, select5)}`}
                                >
                                    <Text style={styles.backButtonTxt}>{option.label}</Text>
                                </Button>
                            ))}
                        </View>
                        <View style={styles.buttonRow}>
                            {directionOptions.map(option => (
                                <Button  
                                key={option.value}
                                style={styles.button} 
                                onPress={() => {setSelect2(option.value)}}
                                appearance={`${getButtonAppearance(option.value, select2)}`}
                                >
                                    <Text style={styles.backButtonTxt}>{option.label}</Text>
                                </Button>
                            ))}
                        </View>
                        <View style={styles.buttonRow}>
                            {tollOptions.map(option => (
                                <Button  
                                key={option.value}
                                style={styles.button} 
                                onPress={() => {setSelect3(option.value)}}
                                appearance={`${getButtonAppearance(option.value, select3)}`}
                                >
                                    <Text style={styles.backButtonTxt}>{option.label}</Text>
                                </Button>
                            ))}
                        </View>
                        <View style={styles.buttonRow}>
                            {turnOptions.map(option => (
                                <Button
                                key={option.value}
                                style={styles.button}
                                onPress={() => {
                                    if (option.value === turnOptions[0].value) {
                                      // If the option is the first option, select only this option
                                      setSelect4([option.value]);
                                    } else {
                                      // If the option is not the first option, add or remove the option value from select4
                                      if (select4.includes(option.value)) {
                                        // Remove the option value from select4 if it's already in the array
                                        setSelect4(select4.filter(value => value !== option.value));
                                      } else {
                                        // Add the option value to select4 if it's not already in the array
                                        setSelect4([...select4, option.value]);
                                      }
                                      if (select4.includes(turnOptions[0].value)) {
                                          setSelect4(select4.filter(value => value !== turnOptions[0].value));
                                    }
                                    }
                                  }}
                                appearance={getButtonAppearance(option.value, select4)}
                              >
                                <Text style={styles.backButtonTxt}>{option.label}</Text>
                              </Button>
                            ))}
                        </View>
                    </View>    
                )
            } else {
                return null
            }
        }
        if(props.accessType === "Area") {
            if(props.data.description === "Parking Garage") {
                return(
                    <View style={styles.optionsModal} ref={optionsRef}>
                        <View style={styles.textRow}>
                            <Text
                                style={styles.inputLabel}
                                >Number of Spots</Text>
                            <TextInput
                                style={styles.inputField}
                                onChangeText={spotsOnChangeText}
                                value={spotsText}
                                placeholder="00"
                                keyboardType='numeric'
                            />
                        </View>  
                        <View style={styles.textRow}>
                            <Text
                                style={styles.inputLabel}
                                >Cost (If any)</Text>
                            <TextInput
                                style={styles.inputField}
                                onChangeText={costOnChangeText}
                                value={costText}
                                placeholder="00"
                                keyboardType='numeric'
                            />
                        </View> 
                        <View style={styles.textRow}>
                            <Text
                                style={styles.inputLabel}
                                >Number of Floors</Text>
                            <RNPickerSelect
                                    onValueChange={(value) => setLaneCount(value)}
                                    items={options}
                                    value={laneCount}
                                    style={styles.inputField}
                                />
                        </View>
                    </View>    
                )
            }
            return(
                <View>
                    <View style={styles.buttonRow}>
                        <Text
                            style={styles.inputLabel}
                        >Number of Spots</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={spotsOnChangeText}
                            value={spotsText}
                            placeholder="00"
                            keyboardType='numeric'
                        />
                    </View>  
                    <View style={styles.buttonRow}>
                        <Text
                            style={styles.inputLabel}
                        >Cost (If any)</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={costOnChangeText}
                            value={costText}
                            placeholder="00"
                            keyboardType='numeric'
                        />
                    </View> 
                    <View style={styles.buttonRow}>

                    </View>
                </View>    
            )
        } 
        else return null;
    })

    const getButtonAppearance = (option, group) => {        
        if (Array.isArray(group)) {
            if (group.includes(option)) {
              return 'primary';
            }
        } else {
            if (option === group) {
              return 'primary';
            }
          }
        return 'outline';
    };



    useLayoutEffect(() => {
        if (showOptionsRef.current) {
          const height = showOptionsRef.current.getHeight() + 135; // add some extra height to accommodate for other elements
          if (containerHeight !== height) {
            setContainerHeight(height);
          }
        }
      }, [showOptionsRef, containerHeight]);
      


    const packageData = () =>{
        const arr = [];

        // if an option is selected push its contents onto the data array 
        // then reset that state for subsequent entries
        if(select1){
            arr.push('Points');
            setSelect1(false)
        }
        if(select2){
            arr.push('Paths');
            setSelect2(false)
        }
        if(select3){
            arr.push('Areas');
            setSelect3(false)
        }
        // return the array of data
        return arr
    }
    
    // changes apperance of buttons based on if its selected or not
    const setSelect = (ind) =>{
        // whenever a button is pushed, based on the select number, change the state to the opposite state (select/deselect)
        switch(ind){
            case 1:
                setSelect1(!select1);
                break;
            
            case 2:
                setSelect2(!select2);
                break;
            
            case 3:
                setSelect3(!select3);
                break;
            
            default:
                console.log("switch's default; ERROR should never enter here");        
        }
    }

    return(
        <Modal transparent={true} animationType='slide' visible={props.visible}>
            <View style={styles.modalContainer}>
                <View style={{ height: containerHeight }}>
                    <View style={[ styles.largePurposeViewContainer, {backgroundColor:theme['background-basic-color-1']}]}
                    onLayout={(event) => {
                        const height = event.nativeEvent.layout.height + 135; // add some extra height to accommodate for other elements
                        if (containerHeight !== height) {
                            setContainerHeight(height);
                        }
                        }}
                    >
                            
                        <Text category={'h1'} style={styles.titleText}>Details</Text>
                        <View style={styles.dataView}>
                                    
                            <View style={styles.titleDesc}>
                                <Text category={'s1'} style={styles.titleDescTxt}>Enter the Access {props.accessType} details</Text>
                            </View>

                            { noneSelect ?
                                <View style={styles.selectError}>
                                    <Text style={styles.redTxt}>Please fill in the details</Text>
                                </View>
                            :
                                null
                            }

                            <ShowOptions ref={showOptionsRef}/>
                                        
                        

                        </View>
                        <View style={styles.controlButtonRow}>
                                <Button style={styles.multiSubmit} onPress={sendData}>
                                    <View>
                                        <Text style={styles.backButtonTxt}>Submit</Text>
                                    </View>
                                </Button>
                                <Button style={styles.multiSubmit} onPress={sendData}>
                                    <View>
                                        <Text style={styles.backButtonTxt}>Cancel</Text>
                                    </View>
                                </Button>
                            </View>
                    </View>                      
                </View>
            </View>
        </Modal>
    )
}