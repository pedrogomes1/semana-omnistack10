import React, { useEffect, useState } from "react";
import api from '../services/api'
import socket from '../services/socket'
import { connect, disconnect, subscribeToNewDev } from '../services/socket'
import MapView, { Marker, Callout } from "react-native-maps"; //O marker deixa uma bandeira no local que vc quer
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from "react-native";
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import { MaterialIcons } from '@expo/vector-icons';

function Main( { navigation }) {

    //Preciso smp armazenar algma info da api em estado
    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null)
    const [techs, setTechs] = useState('')

    useEffect(() => {
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync(); //o granted verifica se a pessoa deu permissão ou não
        
            if (granted) { //Se ela der permissão
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true, //Pega o gps do celular a localização, porém tem que estar com a localização ativa para funcionar                   
                });

                // const latitude = location.coords.latitude;
                // const longitude = location.coords.longitude;      
                const { latitude, longitude } = coords
                
                //Crio um estado para armazenar essas informaçõs(lat e long)
                setCurrentRegion({  
                        latitude,
                        longitude,
                        latitudeDelta: 1.0, //é o zoom do mapa quando ele abre
                        longitudeDelta: 1.0,
    
                    
                })
            }
        
        }
        loadInitialPosition()
    }, [])

    useEffect( () => {
        subscribeToNewDev(dev => setDevs([...devs, dev]))
    },[devs])

    function setupWebSocket() {

        disconnect()

        const { latitude, longitude } = currentRegion

        connect(
            latitude,
            longitude,
            techs,
        );
    }

    async function loadDevs() {

        const { latitude, longitude } = currentRegion //CurrentRegion possui todos estados atual da localização
        console.log(latitude, longitude )
        const response = await api.get('/search', {
            params:{
                latitude,
                longitude,
                techs
            }
        })
        
        setDevs(response.data)
        setupWebSocket();
    }

    async function handleRegionChanged(region){
        setCurrentRegion(region)
    }

    
    if(!currentRegion) { //Só vai mostrar o mapa no momento que renderizar o useEffect e carregar a localizaçã do user
        return null;
    }

  return (
      <>
        <MapView
        initialRegion={currentRegion}
        style={styles.map}
        // OnRegion é executada quando o usuario mudar a localização dele no mapa, ir navegando
        onRegionChangeComplete={handleRegionChanged}>
        {devs.map(dev => (
            <Marker
            key={dev._id}
            coordinate={{ longitude: dev.location.coordinates[0],
                          latitude: dev.location.coordinates[1]}}>

            <Image style ={styles.avatar}
                   source = {{ uri: dev.avatar_url }}
            />

            <Callout onPress={() => {
                //navegação .. navigation vem das props que é mandado pelo routes.js > Main
                navigation.navigate('Profile', { github_username: dev.github_username })//Passo o usuario do git por parametro, para lá no Profile.js receber
            }}>{/* Tudo que vai aparecer assim que clicar no avatar  */}
                <View style={styles.callout}>
                    <Text style={styles.devName}>{dev.name}</Text>
                    <Text style={styles.devBio}>{dev.bio}</Text>
                    <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                </View>
            </Callout>
        </Marker>
        ))}
    </MapView>
        <View style={styles.searchForm}>
            <TextInput 
                style={styles.searchInput}
                placeholder="Buscar devs por tecnologias..."
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setTechs}
            />
            
            <TouchableOpacity onPress={loadDevs}style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
      </>
  )
}

const styles = StyleSheet.create({
    map:{
        flex:1
    },
    avatar:{
        width: 54,
        height:54,
        borderRadius:4,
        borderWidth:4,
        borderColor:'#FFF',
    },
    callout:{
        width:260,
    },
    devName:{
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio:{
        color: '#666',
        marginTop: 5
    },
    devTechs:{
        marginTop: 5
    },
    searchForm:{
        position:'absolute',
        top:20,
        left:20,
        right:20,
        zIndex:5,
        flexDirection: 'row',
    },

    searchInput:{
        flex:1,
        height:50,
        backgroundColor:'#fff',
        color: '#333',
        borderRadius:25,
        paddingHorizontal: 20,
        fontSize:16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width:4,
            height:4
        },
        elevation:2,
    },

    loadButton:{
        width:50,
        height:50,
        backgroundColor:'#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems:'center',
        marginLeft: 15,
    }
})

export default Main;
