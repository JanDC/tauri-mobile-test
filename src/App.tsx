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
import {ArrowDownIcon, ArrowUpIcon, DeleteIcon, EmailIcon} from "@chakra-ui/icons";
import Database from "@tauri-apps/plugin-sql";
import {ArrowUpDownIcon} from "@chakra-ui/icons/ArrowUpDown";

interface Post {
    id: number,
    title: string,
    body: string
    created_at: string
}

const sortOptions = [null, 'ASC', 'DESC']
const sortIcons = [<ArrowUpDownIcon/>, <ArrowUpIcon/>, <ArrowDownIcon/>]
type SortMode = typeof sortOptions[number]

function App() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>(null)
    const [sortIcon, setSortIcon] = useState(<ArrowUpDownIcon/>)

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

    const rotateSortMode = () => {
        const newIndex = (sortOptions.indexOf(sortMode) + 1) % 3
        setSortMode(sortOptions[newIndex])
        setSortIcon(sortIcons[newIndex])
    }

    const getPosts = async () => {
        const db = await Database.load('sqlite:mydatabase.db');
        const result = await db.select<Post[]>(`SELECT id, title, body, created_at
                                                FROM posts ${sortMode ? `ORDER BY created_at ${sortMode}` : ''}`);

        setPosts(result)
    }

    getPosts()

    return (
        <ChakraProvider>
            <Container>
                <Heading size={"xl"}>
                    Our messageboard:
                    <IconButton icon={sortIcon} aria-label={"sort list"} onClick={rotateSortMode}/>
                </Heading>
                <VStack divider={<StackDivider borderColor={'gray.200'}/>} spacing={4} align={'stretch'} padding={4}>
                    {posts.map((post: any) => {
                        return <Box key={post.id} padding={"4px"}>
                            <Heading>
                                {post.title}
                                <IconButton aria-label='Send message' name="delete" type={'button'}
                                            onClick={() => deleteMessage(post.id)}
                                            icon={<DeleteIcon/>}
                                            isRound={true}
                                            background={"tomato"}
                                            padding={"4px"}
                                            margin={"4px"}/>
                            </Heading>
                            <Badge>{post.created_at}</Badge>
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
                                    icon={<EmailIcon/>}
                                    isRound={true}
                        />
                    </FormControl>
                </form>
            </Container>
        </ChakraProvider>
    );
}

export default App;
