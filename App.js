import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import Firebase from "./factory/firebase";

export default function App() {
    const [nome, setNome] = useState();
    const [idade, setIdade] = useState();
    const [email, setEmail] = useState();
    const [codigo, setCodigo] = useState();
    const [ nomePesquisa, setNomePesquisa ] = useState();


    async function save() {
        try {
            await Firebase.firestore().collection("cliente").add({
                nome: nome,
                email: email,
                idade: idade,
            });
            alert("Dados cadastrados com sucesso.");
            clear();
        } catch (error) {
            alert("Erro", error.message);
        }
    }

    async function search() {
        if(!nomePesquisa.trim()){
            alert("Campo em branco, Digite o nome completo para pesquisar");
            return;
        }
        try {
            const busca = await Firebase.firestore().collection("cliente").where("nome", "==", nomePesquisa).get();
            if(!busca.empty){
                const doc = busca.docs[0];
                const data = doc.data();
                // Alert.alert(data.email);
                setCodigo(doc.id || "");
                setNome(data.nome || "")
                setEmail(data.email || "");
                setIdade(data.idade || "");
            } else {
                alert("Cliente não encontrado!");
                clear();
            }
        } catch (error) {
            alert(error);
        }
    }

    async function deleteClient(){
        if(!codigo){
            alert("Consulta um cliente");
            return
        }
        try {
            await Firebase.firestore().collection("cliente").doc(codigo).delete();
            clear();
            alert("Cliente excluído com sucesso");
        } catch (error) {
            alert("Erro ao excluir um cliente");
            return
        }
    }
    
    async function update(){
        try{
            await Firebase.firestore().collection("cliente").doc(codigo).update({
                nome: nome,
                email: email,
                idade: idade
            });
            alert("Cliente alterado com sucesso.");
            clear();
        }catch(error){
            alert(error.message);
        }
    }

    function saveOrUpdate(){
        if(!codigo){
            save();
        }else{
            update();
        }
    }

    function clear(){
        setNomePesquisa("");
        setCodigo("")
        setIdade("");
        setEmail("");
        setNome("");
}

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.container}>
                <View style={styles.searchContainerView}>
                    <Text style={styles.title}>Gestão de dados</Text>
                    <View style={styles.searchView}>
                        <TextInput
                            style={styles.textInputSearch}
                            placeholder="Digite o nome completo"
                            value={nomePesquisa}
                            onChangeText={setNomePesquisa}
                        />
                        <TouchableOpacity
                            style={{ paddingHorizontal: 10 }}
                            onPress={search}
                        >
                            <Fontisto name="search" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.register}>
                    <Text style={styles.title}>Cadastro de clientes</Text>
                    <View style={styles.viewCode}>
                        <Text>Código: </Text>
                        <Text id="codigo">{codigo}</Text>
                    </View>
                    <TextInput
                        style={styles.textInputRegister}
                        placeholder="Digite o nome completo"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={styles.textInputRegister}
                        placeholder="Digite um email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.textInputRegister}
                        placeholder="Digite sua idade"
                        value={idade}
                        onChangeText={setIdade}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveOrUpdate}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                    { !codigo ? "" :
                    <TouchableOpacity style={styles.saveButton} onPress={deleteClient}>
                        <Text style={styles.saveButtonText}>Deletar</Text>
                    </TouchableOpacity>
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
    },
    searchContainerView: {
        gap: 20,
    },

    title: {
        fontSize: 25,
        fontWeight: 600,
    },
    register: {
        gap: 20,
    },
    searchView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    textInputSearch: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        width: 230,
    },
    viewCode: {
        marginBottom: -10,
        flexDirection: "row",
    },

    textInputRegister: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        width: 300,
    },
    saveButton: {
        backgroundColor: "#5eee51",
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 100,
        alignContent: "center",
        alignItems: "center",
    },
    saveButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: 500,
    },
});
