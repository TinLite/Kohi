import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function AddedRecipent({ name, onRemove }: { name: string, onRemove?: () => void }) {
    return (
        <Button size="sm" variant="secondary">@{name}</Button>
    )
}

export default function MessageViewNewChat() {
    function onSendMessage() {

    }
    return (
        <div className="h-screen bg-white flex-grow flex flex-col">
            <h1 className="font-semibold text-xl py-2 px-4">Tạo cuộc trò chuyện mới</h1>
            <Separator />
            <ScrollArea className="flex-grow">
                <div className="px-4 py-8">
                    <div className="grid grid-cols-4 place-items-end items-start gap-4">
                        <div className="text-right my-1">New channel's name:</div>
                            <Input placeholder="Type in new chat channel's name..." className="w-full col-span-3" />
                        <div className="text-right my-1">New chat member:</div>
                        <div className="col-span-3">
                            <div className="flex gap-2 flex-wrap">
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <AddedRecipent name="Alice" />
                                <Input placeholder="Add new user" />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <Separator />
            <div className="bg-background flex gap-2 px-4 py-2">
                <form onSubmit={onSendMessage} className="flex-grow flex gap-2">
                    <Input placeholder="Nhập tin nhắn..." className="flex-grow" name="content" />
                    <Button>Gửi</Button>
                </form>
            </div>
        </div>
    )
}