import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC721, Approval, ApprovalForAll, Transfer } from "../generated/ERC721/ERC721";
import { TokenEntity, ApprovalEntity, ApprovalForAllEntity } from "../generated/schema";

export function handleApproval(event: Approval): void {
  let id = event.address.toHex() + "/" + event.params.owner.toHex() + "/" + event.params.approved.toHex();
  let entity = ApprovalEntity.load(id);
  if (!entity) {
    entity = new ApprovalEntity(id);
    entity.contract = event.address;
  }
  entity.owner = event.params.owner;
  entity.approved = event.params.approved;
  entity.tokenId = event.params.tokenId;
  entity.save();
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let id = event.address.toHex() + "/" + event.params.owner.toHex() + "/" + event.params.operator.toHex();
  let entity = ApprovalForAllEntity.load(id);
  if (!entity) {
    entity = new ApprovalForAllEntity(id);
    entity.contract = event.address;
  }
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;
  entity.save();
}

export function handleTransfer(event: Transfer): void {
  let erc721 = ERC721.bind(event.address);
  let id = event.address.toHex() + "/" + event.params.tokenId.toHex();
  let entity = TokenEntity.load(id);
  if (!entity) {
    entity = new TokenEntity(id);
    entity.contract = event.address;
    entity.tokenId = event.params.tokenId;
    let name = erc721.try_name();
    entity.name = name.reverted ? null : name.value;
    let symbol = erc721.try_symbol();
    entity.symbol = symbol.reverted ? null : symbol.value;
  }
  let ownerOf = erc721.try_ownerOf(event.params.tokenId);
  entity.owner = ownerOf.reverted ? null : ownerOf.value;
  let tokenURI = erc721.try_tokenURI(event.params.tokenId);
  entity.tokenURI = tokenURI.reverted ? null : tokenURI.value;
  entity.save();
}
