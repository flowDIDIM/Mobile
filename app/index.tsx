import { authClient } from "@/lib/auth-client";
import { Alert, Button, Text, View } from "react-native";

export default function Index() {
    const {data: session} = authClient.useSession();

    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/" // this will be converted to a deep link (eg. `myapp://dashboard`) on native
        })
    };

    const handleValidate = async () => {
        const cookies = authClient.getCookie();
        const headers = {
            "Cookie": cookies,
        };
        const response = await fetch("http://127.0.0.1:3000/session", {
            headers,
            // 'include' can interfere with the cookies we just set manually in the headers
            credentials: "omit"
        });
        const data = await response.json();
        Alert.alert(
            "정보",data.user.email
        );
    }

    if (!session) {
        return <View>
            <Text>Please log in</Text>
            <Button title="Login with Google" onPress={handleLogin}/>

        </View>;
    }
    return (<View>
        <Text>Welcome, {session?.user.name}</Text>
        <Button title="validate session" onPress={handleValidate}></Button>
    </View>)

}
