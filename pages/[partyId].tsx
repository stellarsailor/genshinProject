import { useRouter } from 'next/router'

export default function PartyDetail() {
    const router = useRouter()
    const { partyId } = router.query

    return(
        <div>
            {partyId}
        </div>
    )
}

export async function getServerSideProps({ params, req }) {

    // let url = `${serverUrl}/api/bingos/${params.bingoId}`

    // const res = await fetch(url)
    // const data = await res.json()

    // return { props: { data } }
}