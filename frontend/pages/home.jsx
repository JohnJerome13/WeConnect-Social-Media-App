import Layout from '../components/Layout';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getPosts, reset } from '../src/features/posts/postSlice';
import Spinner from '../components/Spinner';

export default function Home() {
	const router = useRouter();
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { posts, isLoading, isError, message } = useSelector(
		(state) => state.posts
	);

	useEffect(() => {
		if (isError) {
			console.log(message);
		}

		if (!user) {
			router.push('/');
		}

		dispatch(getPosts());

		return () => {
			dispatch(reset());
		};
	}, [user, router, isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<Layout>
			<PostForm />
			{posts
				.slice(0)
				.reverse()
				.map((post) => (
					<PostItem key={post._id} post={post} />
				))}
		</Layout>
	);
}
