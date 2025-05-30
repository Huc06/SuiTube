module videoplatform::VideoPlatform {
    use sui::object::{Self, UID};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::tx_context::{Self, TxContext, sender};
    use sui::transfer;
    use std::vector;

    public struct VideoList has key, store {
        id: UID,
        id_counter: u64,
        videos: vector<Video>,
    }

    public struct Video has copy, drop, store {
        id: u64,
        title: vector<u8>,
        desc: vector<u8>,
        cid: vector<u8>,
        owner: address,
        is_short: bool,
        tips: u64,
        rewarded: vector<address>,
    }

    /// Create VideoList object (call once after deploy)
    public entry fun init_video_list(ctx: &mut TxContext) {
        let video_list = VideoList {
            id: object::new(ctx),
            id_counter: 0,
            videos: vector::empty<Video>(),
        };
        sui::transfer::transfer(video_list, sender(ctx));
    }

    /// Add video
    public entry fun add_video(
        video_list: &mut VideoList,
        title: vector<u8>,
        desc: vector<u8>,
        cid: vector<u8>,
        owner: address,
        is_short: bool
    ) {
        let id = video_list.id_counter;
        video_list.id_counter = id + 1;
        let video = Video {
            id,
            title,
            desc,
            cid,
            owner,
            is_short,
            tips: 0,
            rewarded: vector::empty<address>(),
        };
        vector::push_back(&mut video_list.videos, video);
    }

    /// Get number of videos (for FE to iterate)
    public fun video_count(video_list: &VideoList): u64 {
        vector::length(&video_list.videos)
    }

    /// Get video info by index
    public fun get_video(video_list: &VideoList, index: u64): &Video {
        vector::borrow(&video_list.videos, index)
    }

    /// Tip creator (send with SUI coin)
    public entry fun tip(
        video_list: &mut VideoList,
        video_id: u64,
        mut coin: Coin<SUI>,
        _ctx: &mut TxContext
    ) {
        let len = vector::length(&video_list.videos);
        let mut i = 0;
        while (i < len) {
            let video_ref = vector::borrow_mut(&mut video_list.videos, i);
            if (video_ref.id == video_id) {
                let owner_addr = video_ref.owner;
                let amount = sui::coin::value(&coin);
                transfer::public_transfer(coin, owner_addr);
                video_ref.tips = video_ref.tips + amount;
                return
            };
            i = i + 1;
        };
        abort 0x1
    }

    /// Reward viewer (each viewer once per video)
    public entry fun claim_reward(
        video_list: &mut VideoList,
        video_id: u64,
        mut reward_coin: Coin<SUI>,
        _ctx: &mut TxContext
    ) {
        let viewer_addr = sender(_ctx);
        let len = vector::length(&video_list.videos);
        let mut i = 0;
        while (i < len) {
            let video_ref = vector::borrow_mut(&mut video_list.videos, i);
            if (video_ref.id == video_id) {
                // Check if already rewarded
                let rl = vector::length(&video_ref.rewarded);
                let mut j = 0;
                while (j < rl) {
                    if (vector::borrow(&video_ref.rewarded, j) == viewer_addr) {
                        abort 0x2
                    };
                    j = j + 1;
                };
                transfer::public_transfer(reward_coin, viewer_addr);
                vector::push_back(&mut video_ref.rewarded, viewer_addr);
                return
            };
            i = i + 1;
        };
        abort 0x3
    }
}
