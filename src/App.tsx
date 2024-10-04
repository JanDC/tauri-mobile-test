import {invoke} from "@tauri-apps/api/core";
import {
    Box, Button,
    ChakraProvider, Container,
    FormControl,
    Heading,
    IconButton, Input,
    StackDivider,
    Text, Textarea,
    VStack
} from "@chakra-ui/react";
import {ChangeEvent, useState} from "react";
import {EmailIcon} from "@chakra-ui/icons";

function App() {

    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const postMessage = async () => {
        try {
            const response = await invoke("create_post", {title, body});
            debug(response);
            await fetchPosts();
        } catch (e) {
            alert(`Error: ${e}`)
        } finally {
            setBody('');
            setTitle('')
        }
    }
    const fetchPosts = async () => {
        await invoke("get_posts");
        alert('response')
    }

    return (
        <ChakraProvider>
            <Container>
                <VStack divider={<StackDivider borderColor={'gray.200'}/>} spacing={4} align={'stretch'} padding={4}>

                    {posts.map((post: any) => {
                        return <Box h={'40px'} shadow={'md'}>
                            <Heading>{post.title}</Heading>
                            <Text>{post.body}</Text>
                        </Box>
                    })}
                </VStack>


                <form onSubmit={(event: SubmitEvent) => {
                    event.preventDefault();
                    alert(`submit: ${title} ${body}`);
                    postMessage()

                }}>
                    <FormControl>
                        <Input type="text" name="message" id="message"
                               onChange={(event: ChangeEvent) => setTitle(event.currentTarget.value)}/>
                        <Textarea name="body" placeholder='Here is a sample placeholder'
                                  onChange={(event: ChangeEvent) => setBody(event.currentTarget.value)}/>
                    </FormControl>
                    <IconButton aria-label='Send message' name="submit" value={'plop'} type={'submit'}
                                icon={<EmailIcon/>}/>
                </form>
            </Container>
        </ChakraProvider>
    );
}

export default App;
