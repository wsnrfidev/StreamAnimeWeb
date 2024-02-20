"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from "./component.module.css"
import placeholderImg from "@/public/photo-placeholder.jpg"
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import CheckSvg from "@/public/assets/check-circle.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { DocumentData, DocumentSnapshot, FieldPath, arrayRemove, arrayUnion, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'

function GoGoAnimeEpisode({ data, mediaId }: { data: MediaEpisodes, mediaId: number }) {

    const [wasEpisodeWatched, setWasEpisodeWatched] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // ADD OR REMOVE EPISODE FROM FIRESTORE
    async function handleEpisodeWatch() {

        setIsLoading(true)

        if (!user) return

        if (!wasEpisodeWatched) {

            await setDoc(doc(db, 'users', user.uid),
                {
                    episodesWatchedBySource: {
                        gogoanime: {
                            [mediaId]: arrayUnion(...[{

                                mediaId: mediaId,
                                episodeId: data.id,
                                episodeTitle: data.number

                            }])
                        }
                    }
                } as unknown as FieldPath,
                { merge: true }
            )

            setWasEpisodeWatched(true)

        }
        else {

            await setDoc(doc(db, 'users', user.uid),
                {
                    episodesWatchedBySource: {
                        gogoanime: {
                            [mediaId]: arrayRemove(...[{

                                mediaId: mediaId,
                                episodeId: data.id,
                                episodeTitle: data.number

                            }])
                        }
                    }
                } as unknown as FieldPath,
                { merge: true }
            )

            setWasEpisodeWatched(false)

        }

        setIsLoading(false)
    }

    // CHECK IF EPISODE IS ON FIRESTORE, THEN CHANGE STATE
    async function checkEpisodeMarkedAsWatched() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return

        const onGoGoAnimeList = userDoc.get("episodesWatchedBySource")?.gogoanime

        if (!onGoGoAnimeList) return

        const episodedWatched = onGoGoAnimeList[mediaId]?.find(
            (item: { episodeId: string }) => item.episodeId == data.id
        )

        if (episodedWatched) setWasEpisodeWatched(true)

    }

    useEffect(() => {

        if (!user) return

        checkEpisodeMarkedAsWatched()

    }, [user])

    return (
        <li className={styles.container}>

            <Link href={`/watch/${mediaId}?q=${data.id}`} className={styles.img_container}>
                <Image
                    src={placeholderImg}
                    data-other-source={true}
                    fill
                    sizes='100%'
                    alt={`Watch episode ${data.number}`}
                    placeholder='blur'
                    blurDataURL={'data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScgLz4KICAgICAgPC9maWx0ZXI+CgogICAgICA8aW1hZ2UgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZScgZmlsdGVyPSd1cmwoI2IpJyB4PScwJyB5PScwJyBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyAKICAgICAgaHJlZj0nZGF0YTppbWFnZS9hdmlmO2Jhc2U2NCwvOWovMndCREFBZ0dCZ2NHQlFnSEJ3Y0pDUWdLREJRTkRBc0xEQmtTRXc4VUhSb2ZIaDBhSEJ3Z0pDNG5JQ0lzSXh3Y0tEY3BMREF4TkRRMEh5YzVQVGd5UEM0ek5ETC8yd0JEQVFrSkNRd0xEQmdORFJneUlSd2hNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpML3dBQVJDQUFMQUJBREFTSUFBaEVCQXhFQi84UUFGZ0FCQVFFQUFBQUFBQUFBQUFBQUFBQUFCZ01ILzhRQUloQUFBZ0lDQWdFRkFRQUFBQUFBQUFBQUFRSURCQVVSQUNFU0JoTVVNVUhCLzhRQUZRRUJBUUFBQUFBQUFBQUFBQUFBQUFBQUFBTC94QUFaRVFBREFBTUFBQUFBQUFBQUFBQUFBQUFBQVJFQ0lUSC8yZ0FNQXdFQUFoRURFUUEvQU5KdFhNbEZqekxjaGZIMVl4dDVQa3B2ZjUzL0FEWGZJeGVzemtFclJZK3V0eVYxVVNsU3dDc1U4aHM2ME5nRTY0aEVVZCtrOWEzR2swRWkrTG82Z2dnOWNNNTJOYU9GdFdxbzltWlN6cXlIV2pvOWdmWDd3M3VsNHpoLy85az0nIC8+CiAgICA8L3N2Zz4KICA='}>
                </Image>
            </Link>

            <div className={styles.title_button_container}>
                <h3>
                    <Link href={`/watch/${mediaId}?q=${data.id}`}>
                        {`Episode ${data.number}`}
                    </Link>
                </h3>

                {user && (

                    <button
                        onClick={() => handleEpisodeWatch()}
                        data-active={wasEpisodeWatched}
                        disabled={isLoading}
                        title={wasEpisodeWatched ? "Mark as Unwatched " : "Mark as Watched"}
                    >
                        {wasEpisodeWatched ? (
                            <CheckFillSvg width={16} height={16} alt="Check Episode as Watched" />
                        ) : (
                            <CheckSvg width={16} height={16} alt="Check Episode as Not Watched" />
                        )}
                    </button>

                )}

            </div>

        </li>
    )
}

export default GoGoAnimeEpisode