#ifndef __CONNECTION_H__
#define __CONNECTION_H__
#include <mysqlx/xdevapi.h>
#include <memory>
#include <string>

/**
 * @brief 数据库连接
*/
class Connection final {
public:
	/**
	 * @brief 获取一张表
	 * @param name 表名字
	 * @return
	*/
	static std::shared_ptr<mysqlx::Table> getTable(const std::string &name) {
		try {
			if (session_ == nullptr) {
				session_ = std::shared_ptr<mysqlx::Session>(new mysqlx::Session(
					mysqlx::SessionOption::HOST, "localhost",
					mysqlx::SessionOption::PORT, 33060,
					mysqlx::SessionOption::USER, "root",
					mysqlx::SessionOption::PWD, "root",
					mysqlx::SessionOption::DB, "company"));
				schema_ = std::shared_ptr<mysqlx::Schema>(new mysqlx::Schema(session_->getDefaultSchema()));
			}

		} catch (...) {
			throw "数据库未正确连接";
		}
		return std::shared_ptr<mysqlx::Table>(new mysqlx::Table(schema_->getTable(name)));
	}

	/**
	 * @brief 开启事务
	*/
	static void startTranscation() {
		if (session_ != nullptr) {
			session_->startTransaction();
		}
	}

	/**
	 * @brief 关闭数据库连接
	*/
	static void closeSession() {
		if (session_ != nullptr) {
			session_->close();
		}
	}

	/**
	 * @brief 提交事务
	*/
	static void commit() {
		if (session_ != nullptr) {
			session_->commit();
		}
	}

	/**
	 * @brief 回滚
	*/
	static void rollback() {
		if (session_ != nullptr) {
			session_->rollback();
		}
	}
private:
	static std::shared_ptr<mysqlx::Session> session_;
	static std::shared_ptr<mysqlx::Schema> schema_;
};
#endif // !__CONNECTION_H__
