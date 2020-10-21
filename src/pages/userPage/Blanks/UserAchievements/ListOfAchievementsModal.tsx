import { DeleteOutlined, DownloadOutlined, EyeOutlined, EyeTwoTone, FileImageOutlined, FilePdfOutlined } from "@ant-design/icons";
import { List, message, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getAchievementFile, openAchievemetFile, removeAchievementDocument, getAchievementsByPage } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import classes from "./ListOfAchievements.module.css"
import notificationLogic from '../../../../components/Notifications/Notification';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from "react-router-dom";



interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    achievementDoc: BlankDocument[];
    setAchievementDoc: (document: BlankDocument[]) => void;
    userToken: any;
}

const ListOfAchievementsModal = (props: Props) => {
    const { userId } = useParams();
    const [currentUser, setCuurrentUser] = useState(false);
    const [loadingMore, setLoadingMore] = useState({
        loading: false,
        hasMore: true
    });
    const [achievements, setAchievements] = useState<BlankDocument[]>([]);
    let [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(7);

    const handleCancel = () => {
        props.setVisibleModal(false);
    }

    const deleteFIle = async (documentId: number, fileName: string) => {
        await removeAchievementDocument(documentId);
        notificationLogic('success', `Файл "${fileName}" успішно видалено`);
        props.setAchievementDoc(props.achievementDoc.filter((d) => d.id !== documentId));
    }

    const downloadFile = async (fileBlob: string, fileName: string) => {
        await getAchievementFile(fileBlob, fileName);
    }

    const hideDelete = () => {
        if (props.userToken.nameid === userId) {
            setCuurrentUser(false);
        } else {
            setCuurrentUser(true);
        }
    }

    const reviewFile = async (blobName: string, fileName: string) => {
        await openAchievemetFile(blobName, fileName);
    }

    const getAchievements = async () => {
        const response = await getAchievementsByPage(pageNumber, pageSize, userId);
        var concatedAchievements = achievements.concat(response.data);
        setAchievements(concatedAchievements);
        setLoadingMore({ loading: false, hasMore: true });
    };
    const handleInfiniteOfLoad = () => {
        setLoadingMore({ loading: true, hasMore: true });
        setPageNumber(++pageNumber);
        if (props.achievementDoc.length === achievements.length) {
            message.success(`Всі файли завантажено`);
            setLoadingMore({ loading: false, hasMore: false });
            return;
        }
        getAchievements();
    }

    useEffect(() => {
        hideDelete();
        getAchievements();
    }, []);

    return (
        <Modal
            title="Список досягнень"
            visible={props.visibleModal}
            footer={null}
            onCancel={handleCancel}
        >
            <div className={classes.demoInfiniteContainer}>
                <InfiniteScroll
                    pageStart={pageNumber}
                    loadMore={handleInfiniteOfLoad}
                    hasMore={!loadingMore.loading && loadingMore.hasMore}
                    useWindow={false}>
                    <List
                        dataSource={achievements}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <DownloadOutlined
                                        className={classes.downloadIcon}
                                        onClick={() => downloadFile(item.blobName, item.fileName)}
                                    />,
                                    <EyeOutlined
                                        className={classes.reviewIcon}
                                        onClick={() => reviewFile(item.blobName, item.fileName)} />,
                                    <DeleteOutlined
                                        hidden={currentUser}
                                        className={classes.deleteIcon}
                                        onClick={() => deleteFIle(item.id, item.fileName)}
                                    />
                                ]}>
                                {item.blobName.split(".")[1] === "pdf"
                                    ?
                                    <FilePdfOutlined
                                        className={classes.fileIcon} />
                                    :
                                    <FileImageOutlined
                                        className={classes.fileIcon}
                                    />
                                }
                                <List.Item.Meta
                                    className={classes.text}
                                    title={item.fileName}
                                />
                            </List.Item>
                        )}
                    >
                        {loadingMore.loading && loadingMore.hasMore && (
                            <div className={classes.demoLoadingContainer}>
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        </Modal>
    );
}
export default ListOfAchievementsModal;