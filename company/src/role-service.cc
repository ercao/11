#include "../include/service.h"
ResultEntity<PageInfo<Role>> RoleService::getList(const string &page_no,
                                                  const string &page_size) {
  static const string &GETLIST_SUCCESSED = "获取角色信息成功";
  static const string &GETLIST_FAILED = "获取角色信息失败：";
  try {
    int no = std::stoi(page_no);
    if (no <= 0) {
      throw string("页码非法");
    }

    int size = std::stoi(page_size);
    if (size <= 0) {
      throw string("页数非法");
    }
    auto result = role_dao_->getList(no, size);
    return ResultEntity<PageInfo<Role>>::successResultWidthData(
        "成功获取到" + to_string(result->data_.size()) + "条数据", result);
  } catch (const string &e) {
    return ResultEntity<PageInfo<Role>>::faildResult(GETLIST_FAILED + e);
  } catch (const exception &e) {
    return ResultEntity<PageInfo<Role>>::faildResult(GETLIST_FAILED + e.what());
  }
}
