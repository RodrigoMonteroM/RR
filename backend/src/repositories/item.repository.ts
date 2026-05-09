import { prisma } from "@/lib/prisma";

export const itemRepository = {
    findItemByBoxId:  function(boxId: string){
        return prisma.item.findMany({
            where: {boxId},
            orderBy: {createdAt: 'desc'},
            include: {
                createdBy: {select: {id:true, nickname: true}}
            }
        })
    },

    findItemById: function(id: string){
        return prisma.item.findUnique({
            where: {id},
            include: {
                box: true,
                createdBy: {select: {id:true, nickname: true}}
            }
        });
    },

    create: function (data: {content: string, boxId: string, createdByUserId: string }){
        return prisma.item.create({
            data,
            include: {
                createdBy: { select: { id: true, nickname: true } },
            },
        })
    },

    update: function (id: string, data: {content: string}){
        return prisma.item.update({
            where: {id},
            data,
            include: {
                createdBy: { select: {id:true, nickname: true}}
            }
        })
    },

    updateItemToggle: function (id: string, completed: boolean){
        return prisma.item.update({
            where: {id},
            data: {
                completed
            },
            include: {
                createdBy: { select: {id:true, nickname: true}}
            }
        })
    },


    delete: function (id: string){
        return prisma.item.delete({
            where: {id}
        });
    }

}