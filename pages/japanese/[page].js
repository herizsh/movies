import { getTweets } from "../api/tweets";
import { Tweet } from "react-twitter-widgets";
import HeaderCustom from "../../components/HeaderCustom";
import { useRouter } from 'next/router';
import { Box } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useEffect } from "react"
import * as ga from '../../lib/ga'



export default function Home({ data, page, count_page }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const displayTweets = data?.docs.map((tweet) => {
    return (
      <>
      <div style={{ minHeight: "200px", backgroundColor: "#F5F8FA", width: "40%", margin: "auto", marginTop: "5px", borderRadius: "10px", border: "1px solid #E1E8ED", padding: "10px" }} key={tweet._id}>
        <Tweet renderError={(_err) => <p>Could not load tweet</p>} tweetId={tweet.id} />
      </div>
      </>
    );
  });
  const handleChange = ( _, value) => {
    router.push(`/asian/${value}`)
  };

  return (
    <>
      <HeaderCustom/>
      <div style={{ marginTop: "5px", minHeight: "1px" }}></div>
      <div styles={{ margin: "auto", width: "60%", border: "1px solid #666666", padding: "5px"}}>
        {displayTweets}
      </div>
      <div>
      </div>
      <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
          <Pagination count={count_page} page={page} size="large" onChange={handleChange} variant="outlined" color="primary" siblingCount={3} boundaryCount={4}/>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const query = {
    category: "asian"
  };
  const options = {
    page: 1,
    limit: 30,
    collation: {
      locale: "en",
    },
  };

  let data = await getTweets(options, query);
  data = JSON.parse(JSON.stringify(data));

  const paths = []

  for(let i = 0; i < data.totalPages; i += 1) {
      const temp_page = i.toString()
      if(i != 404) {
        paths.push({
          params: { page: temp_page}
      })
      }
  }

  return {
    paths,
    fallback: true, // See the "fallback" section in docs
  };
}

export async function getStaticProps(context) {
  const query = {
    category: "asian"
  };
  const { page } = context.params;
  const options = {
    page: page ? page : 1,
    limit: 30,
    collation: {
      locale: "en",
    },
  };

  let data = await getTweets(options, query);
  data = JSON.parse(JSON.stringify(data));
  console.log(data.totalPages, "INI TOTAL PAGES")

  const selectedPage = Number(page)

  return {
    props: { data, page: selectedPage, count_page: data.totalPages },
  };
}
