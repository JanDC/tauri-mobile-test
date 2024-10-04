import {
    Box,
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
import Database from "@tauri-apps/plugin-sql";

interface Post {
    id: number,
    title: string,
    body: string
}

function App() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const postMessage = async () => {
        console.log('posting');
        const db = await Database.load('sqlite:mydatabase.db');
        const response = await db.execute('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body]);
        console.log(response);

        await getPosts()
    }

    const getPosts = async () => {
        const db = await Database.load('sqlite:mydatabase.db');
        const result = await db.select<Post[]>('SELECT id, title, body FROM posts');
        console.log(result);

        setPosts(result)
    }

    return (
        <ChakraProvider>
            <Container>
                <VStack divider={<StackDivider borderColor={'gray.200'}/>} spacing={4} align={'stretch'} padding={4}>

                    {posts.map((post: any) => {
                        return <Box key={post.id} h={'40px'} shadow={'md'}>
                            <Heading>{post.title}</Heading>
                            <Text>{post.body}</Text>
                        </Box>
                    })}
                </VStack>


                <form>
                    <FormControl>
                        <Input type="text" name="message" id="message"
                               onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value)}/>
                        <Textarea name="body" placeholder='Here is a sample placeholder'
                                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setBody(event.currentTarget.value)}/>
                    </FormControl>
                    <IconButton aria-label='Send message' name="submit" value={'plop'} type={'button'}
                                onClick={() => postMessage()}
                                icon={<EmailIcon/>}/>
                </form>
            </Container>
        </ChakraProvider>
    );
}

export default App;
