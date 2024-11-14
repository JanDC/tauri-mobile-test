import {
    Badge,
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
import {DeleteIcon, EmailIcon} from "@chakra-ui/icons";
import Database from "@tauri-apps/plugin-sql";

interface Post {
    id: number,
    title: string,
    body: string
    created_at: string
}

function App() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const postMessage = async () => {
        const db = await Database.load('sqlite:mydatabase.db');
        await db.execute('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body]);
        setBody('')
        setTitle('')
        await getPosts()
    }

    const deleteMessage = async (id: number) => {
        const db = await Database.load('sqlite:mydatabase.db');
        await db.execute('DELETE FROM posts WHERE id = ?', [id]);
        await getPosts()
    }

    const getPosts = async () => {
        const db = await Database.load('sqlite:mydatabase.db');
        const result = await db.select<Post[]>('SELECT id, title, body, created_at FROM posts');

        setPosts(result)
    }

    getPosts()

    return (
        <ChakraProvider>
            <Container>
                <Heading size={"xl"}>
                    Our messageboard:
                </Heading>
                <VStack divider={<StackDivider borderColor={'gray.200'}/>} spacing={4} align={'stretch'} padding={4}>
                    {posts.map((post: any) => {
                        return <Box key={post.id} padding={"4px"}>
                            <Heading>{post.title}
                                <Badge>{post.created_at}</Badge>
                                <IconButton aria-label='Send message' name="delete" type={'button'}
                                            onClick={() => deleteMessage(post.id)}
                                            icon={<DeleteIcon/>}
                                            padding={"4px"}/>
                            </Heading>
                            <Text>{post.body}</Text>
                        </Box>
                    })}
                </VStack>


                <form>
                    <FormControl border={"dashed"} padding={"4px"}>
                        <Heading size={"lg"}>
                            Add a new message:
                        </Heading>
                        <Input type="text" name="message" id="message"
                               placeholder={'Enter your message here'}
                               value={title}
                               onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value)}
                        />
                        <Textarea name="body" placeholder='Here is a sample placeholder'
                                  value={body}
                                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setBody(event.currentTarget.value)}/>
                        <IconButton aria-label='Send message' name="submit" value={'plop'} type={'button'}
                                    onClick={() => postMessage()}
                                    icon={<EmailIcon/>}/>
                    </FormControl>
                </form>
            </Container>
        </ChakraProvider>
    );
}

export default App;
