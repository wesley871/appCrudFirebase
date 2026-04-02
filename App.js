import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import * as KeepAwake from "expo-keep-awake";
import Firebase from "./factory/firebase";

export default function App() {
    const [nome, setNome] = useState();
    const [idade, setIdade] = useState();
    const [email, setEmail] = useState();

    const [ nomePesquisa, setNomePesquisa ] = useState();


    async function save() {
        try {
            await Firebase.firestore().collection("cliente").add({
                nome: nome,
                email: email,
                idade: idade,
            });
            setNome("");
            setEmail("");
            setIdade("");
            Alert.alert("Dados cadastrados com sucesso.");
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    }

    async function search() {
        if(!nomePesquisa.trim()){
            Alert.alert("Campo em branco, Digite o nome completo para pesquisar");
            return;
        }
        try {
            const busca = await Firebase.firestore().collection("cliente").where("nome", "==", nomePesquisa).get();
            if(!busca.empty){
                const doc = busca.docs[0];
                const data = doc.data();
                // Alert.alert(data.email);
                setNome(data.nome || "")
                setEmail(data.email || "");
                setIdade(data.idade || "");
            } else {
                Alert.alert("Cliente não encontrado!");
                setNome("");
                setEmail("");
                setIdade("");
            }
        } catch (error) {
            Alert.alert(error);
        }
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
                        <Text id="codigo">...</Text>
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
                    <TouchableOpacity style={styles.saveButton} onPress={save}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
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
