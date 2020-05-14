class CommentList extends React.Component {
    render() {
        // render the comments dynamically.
        const commentNodes = this.props.data.map(comment => (
            <Comment author={comment.author} key={comment.id}>
                {comment.text}
            </Comment>
            )
        );
        return (
            <div className="commentList">
                {commentNodes}
                {/*
                    Hello, world! I am a CommentList...!
                    <Comment author="Daniel Lo Nigro">
                        Hello ReactJS.NET World!
                    </Comment>
                    <Comment author="Pete Hunt">
                        This is one comment
                    </Comment>
                    <Comment author="Jordan Walke">
                        This is *another* comment
                    </Comment>
                */}
            </div>
        );
    }
}

function createRemarkable() {
    var remarkable =
        'undefined' !== typeof global && global.Remarkable
            ? global.Remarkable
            : window.Remarkable;

    return new remarkable();
}

class Comment extends React.Component {
    rawMarkup() {
        const md = new Remarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }
    render() {
        const md = createRemarkable();
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                {/*{md.render(this.props.children.toString())}*/}
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { author: '', text: '' };
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        // Callback function from CommentBox.
        this.props.onCommentSubmit({ author: author, text: text });
        // Clear state after submit is done.
        this.setState({ author: '', text: '' });
    }
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit} >
                <div>Hello, world! I am a CommentForm.</div>
                <input
                    // controlled component.
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    // controlled component.
                    type="text"
                    placeholder="Your information..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="POST" />
            </form>
        );
    }
}

class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }
    //UNSAFE_componentWillMount() {
    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        xhr.send();
    }

    componentDidMount() {
        this.loadCommentsFromServer();
        window.setInterval(
            () => this.loadCommentsFromServer(),
            this.props.pollInterval,
        );
    }

    // Callback function to CommentForm.
    // Submit to the server and refresh(update) the list.
    handleCommentSubmit(comment) {
        const data = new FormData();
        data.append('Author', comment.author);
        data.append('Text', comment.text);

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = () => this.loadCommentsFromServer();
        xhr.send(data);
    }

    render() {
        return (
            <>
                <div className="commentBox">
                    <CommentList data={this.state.data} />
                    <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                </div>

                <h1>------- Test ------</h1>
                <div className="commentBox1">Hello, world! I am a CommentBox.</div>
                <div className="commentBox2" > Bye, world! I am a CommentBox2.</div>
                //<div className="commentBox3" >1. This is NOT a comment</div>
                {/*comment*/}
                {/*<div className="commentBox4" >comment.</div>*/}
                <div className="commentBox5" // 2. this is a comment 
                >
                    3. This is NOT a comment
                    // 4. This is NOT a comment
                </div>
            </>
        );
    }
}

// hard-coded source data.
const data = [
    { id: 1, author: 'Daniel Lo Nigro', text: 'Hello ReactJS.NET World!' },
    { id: 2, author: 'Pete Hunt', text: 'This is one comment' },
    { id: 3, author: 'Jordan Walke', text: 'This is *another* comment' },
];
//ReactDOM.render(<CommentBox data={data} />, document.getElementById('content'));

ReactDOM.render(<CommentBox url="/comments" pollInterval={2000} submitUrl="/comments/new" />, document.getElementById('content'));
